'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import {
  fetchPoolByInviteCode,
  joinPoolByInviteCode,
  resolvePoolDocumentIdFromJoinResponse,
} from '@/lib/pools';
import { normalizePoolFromApi } from '@/lib/pool-normalize';
import {
  isAlreadyMemberError,
  messageForJoinError,
} from '@/lib/join-messages';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { saveBtn } from '@/components/MatchCard/matchCard.styles';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import type { Pool, PoolMembership } from '@/types';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function InvitePoolPreview({ pool }: { pool: Pool }) {
  const description = pool.description?.trim();
  const valueCents = pool.value ?? 0;
  const adminLabel =
    pool.admin?.username?.trim() || pool.admin?.email?.trim() || null;

  return (
    <section
      className="rounded-xl border border-dashed border-emerald-200/90 bg-linear-to-br from-emerald-50/50 to-white px-5 py-6 shadow-sm sm:px-6 sm:py-7"
      aria-labelledby="invite-pool-heading"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start sm:gap-5">
          <div
            className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/90 text-emerald-800 shadow-inner shadow-emerald-900/5 sm:mx-0"
            aria-hidden
          >
            <EmojiEventsOutlinedIcon sx={{ fontSize: 28 }} />
          </div>

          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <h2
              id="invite-pool-heading"
              className="text-xl font-semibold leading-snug text-slate-900 sm:text-2xl"
            >
              {pool.name}
            </h2>
            {description ? (
              <p className="mx-auto max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-slate-600 sm:mx-0">
                {description}
              </p>
            ) : null}
            {adminLabel ? (
              <p className="text-sm text-slate-600">
                Administrador:{' '}
                <span className="font-medium text-slate-900">{adminLabel}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white px-4 py-3 shadow-sm shadow-neutral-950/5 sm:min-w-55">
          <dl>
            <div className="flex items-baseline justify-between gap-6">
              <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                Entrada
              </dt>
              <dd className="text-base font-semibold tabular-nums text-neutral-900">
                {brl.format(valueCents / 100)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default function InvitePage() {
  const params = useParams();
  const inviteCode = params.inviteCode as string;
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();

  const [pool, setPool] = useState<Pool | null>(null);
  const [poolError, setPoolError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinBusy, setJoinBusy] = useState(false);
  const [membershipCheckedDocumentId, setMembershipCheckedDocumentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    fetchPoolByInviteCode(inviteCode)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setPoolError(
            'Convite inválido ou bolão não encontrado.'
          );
          setPool(null);
          return;
        }
        setPoolError('');
        setPool(p);
      })
      .catch(() => {
        if (!cancelled) {
          setPool(null);
          setPoolError(
            'Não foi possível verificar o convite. Tente novamente.'
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  const goToPool = useCallback(
    (documentId: string) => {
      router.replace(`/pool/${documentId}/ranking`);
    },
    [router]
  );

  useEffect(() => {
    if (!hasHydrated || !jwt || !pool?.documentId) {
      return;
    }

    let cancelled = false;

    Promise.allSettled([
      apiFetch<unknown>(`/api/pools/${pool.documentId}/session`, {}, jwt),
      apiFetch<{ data: PoolMembership[] }>(
        '/api/pools/mine/memberships',
        {},
        jwt
      ),
    ])
      .then((results) => {
        if (cancelled) return;
        const sessionRes =
          results[0].status === 'fulfilled' ? results[0].value : null;
        const membershipsRes =
          results[1].status === 'fulfilled' ? results[1].value : null;
        const normalized = sessionRes ? normalizePoolFromApi(sessionRes) : null;
        let joinedAt = normalized?.viewerJoinedAt;
        if (!joinedAt && membershipsRes) {
          const membership = (membershipsRes.data || []).find(
            (m) =>
              m.pool.documentId === pool.documentId ||
              m.pool.inviteCode === pool.inviteCode
          );
          joinedAt = membership?.joinedAt;
        }
        if (joinedAt) {
          goToPool(pool.documentId);
          return;
        }
        setMembershipCheckedDocumentId(pool.documentId);
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, jwt, pool?.documentId, pool?.inviteCode, goToPool]);

  const needsMembershipCheck = hasHydrated && Boolean(jwt && pool?.documentId);
  const membershipCheckComplete =
    !needsMembershipCheck || membershipCheckedDocumentId === pool?.documentId;

  const runJoin = useCallback(async () => {
    if (!jwt || !pool) return;
    setJoinBusy(true);
    setJoinError('');
    try {
      const body = await joinPoolByInviteCode(inviteCode, jwt);
      const id =
        resolvePoolDocumentIdFromJoinResponse(body) ?? pool.documentId;
      goToPool(id);
    } catch (err: unknown) {
      if (isAlreadyMemberError(err) && pool) {
        goToPool(pool.documentId);
        return;
      }
      setJoinError(messageForJoinError(err));
    } finally {
      setJoinBusy(false);
    }
  }, [jwt, pool, inviteCode, goToPool]);

  const declineInvite = useCallback(() => {
    router.replace(MEUS_BOLOES_PATH);
  }, [router]);

  const loginHref = `/login?returnUrl=${encodeURIComponent(
    `/invite/${inviteCode}`
  )}`;

  if (!hasHydrated) {
    return <p className="mt-16 text-center">Carregando...</p>;
  }

  if (poolError) {
    return (
      <div className="mt-16">
        <PageBreadcrumb label="Convite" className="mb-4" />
        <div className="rounded-xl border border-dashed border-emerald-200/90 bg-linear-to-br from-emerald-50/50 to-white px-6 py-10 text-center shadow-sm">
          <p className="text-red-600 mb-4">{poolError}</p>
          <Link
            href={MEUS_BOLOES_PATH}
            className="text-sm font-medium text-emerald-800 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950 hover:decoration-emerald-700"
          >
            Voltar aos bolões
          </Link>
        </div>
      </div>
    );
  }

  if (!pool || pool.inviteCode !== inviteCode) {
    return <p className="mt-16 text-center">Carregando convite...</p>;
  }

  if (jwt && !membershipCheckComplete) {
    return <p className="mt-16 text-center">Carregando convite...</p>;
  }

  if (jwt && joinError) {
    return (
      <div className="mx-auto mt-16 max-w-lg space-y-6">
        <PageBreadcrumb label="Convite" className="mb-0" />
        <div className="rounded-xl border border-dashed border-emerald-200/90 bg-linear-to-br from-emerald-50/50 to-white px-6 py-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">{pool.name}</h1>
          <p className="mt-3 text-sm text-red-600">{joinError}</p>
          <button
            type="button"
            disabled={joinBusy}
            onClick={() => {
              void runJoin();
            }}
            className={twMerge(saveBtn, 'mt-5 hover:bg-emerald-700')}
          >
            {joinBusy ? 'Tentando...' : 'Tentar novamente'}
          </button>
          <p className="mt-6">
            <Link
              href={MEUS_BOLOES_PATH}
              className="text-sm font-medium text-emerald-800 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950 hover:decoration-emerald-700"
            >
              Voltar aos bolões
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-2xl space-y-6">
      <section
        aria-labelledby="invite-heading"
        className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/95 via-white to-amber-50/45 px-5 py-6 shadow-[0_12px_40px_-24px_rgba(6,78,59,0.22)] md:px-8 md:py-7"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-linear-to-br from-emerald-600/20 via-transparent to-emerald-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-linear-to-tr from-amber-400/16 to-transparent blur-3xl"
          aria-hidden
        />

        <div className="relative space-y-3">
          <PageBreadcrumb label="Convite" className="mb-0 opacity-90" />
          <h1
            id="invite-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
          >
            Você foi convidado para um bolão
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
            Revise as informações abaixo antes de entrar.
            {jwt ? (
              <>
                {' '}
                Ao aceitar, você passa a participar deste bolão e deve seguir
                as regras e o pagamento definidos pelo administrador.
              </>
            ) : (
              <>
                {' '}
                Para aceitar o convite, faça login ou crie uma conta.
              </>
            )}{' '}
            Consulte também as{' '}
            <Link
              href="/regras-e-pontuacao"
              className="font-medium text-emerald-800 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950 hover:decoration-emerald-700"
            >
              regras e pontuação
            </Link>
            .
          </p>
        </div>
      </section>

      <InvitePoolPreview pool={pool} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={joinBusy}
          onClick={declineInvite}
          className="inline-flex min-h-9 items-center justify-center rounded-xl border border-emerald-200/90 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:opacity-50"
        >
          Recusar
        </button>
        {jwt ? (
          <button
            type="button"
            disabled={joinBusy}
            onClick={() => {
              void runJoin();
            }}
            className={twMerge(saveBtn, 'hover:bg-emerald-700')}
          >
            {joinBusy ? 'Entrando...' : 'Aceitar e entrar'}
          </button>
        ) : (
          <Link
            href={loginHref}
            className={twMerge(saveBtn, 'hover:bg-emerald-700')}
          >
            Fazer login
          </Link>
        )}
      </div>
    </div>
  );
}
