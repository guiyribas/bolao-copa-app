'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { PoolNav } from '@/components/PoolNav/poolNav';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import { formatJoinedPtBr } from '@/lib/format-joined-date';
import { normalizePoolFromApi } from '@/lib/pool-normalize';
import { isSameUser } from '@/lib/user-match';
import { PoolLayoutProvider } from '@/contexts/pool-layout-context';
import {
  POOL_NO_ENTRY_FEE_EXPLAINER,
  POOL_NO_ENTRY_FEE_TITLE,
} from '@/lib/site-brand';
import type { Pool, PoolMembership } from '@/types';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function PoolHeader({ pool }: { pool: Pool }) {
  const description = pool.description?.trim();
  const joined = pool.viewerJoinedAt
    ? formatJoinedPtBr(pool.viewerJoinedAt)
    : '';
  const memberCount = pool.memberCount ?? 0;
  const paidCount = pool.paidCount ?? 0;
  const valueCents = pool.value ?? 0;
  const hasEntryFee = valueCents > 0;
  /** `pool.value` é guardado em centavos; aqui convertemos para reais ao formatar. */
  const totalCollectedCents =
    pool.totalCollected ?? paidCount * valueCents;
  const expectedTotalCents = memberCount * valueCents;
  const hasMembers = memberCount > 0;

  const summaryCardClass =
    'w-full rounded-xl border border-neutral-200/80 bg-white px-4 py-3 shadow-sm shadow-neutral-950/5';
  const summaryCardNoFeeClass =
    'w-full rounded-xl border border-neutral-200/80 bg-white px-3 py-2 shadow-sm shadow-neutral-950/5';

  return (
    <header
      className="mb-6 overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-white via-white to-neutral-50 p-5 shadow-sm shadow-neutral-950/5 sm:p-6"
      aria-labelledby="pool-heading"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0 w-full sm:flex-[2]">
          <h1
            id="pool-heading"
            className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
          >
            {pool.name}
          </h1>
          {description ? (
            <p className="mt-2 max-w-prose whitespace-pre-wrap text-sm leading-relaxed text-neutral-600">
              {description}
            </p>
          ) : null}
        </div>

        <div className="min-w-0 w-full shrink-0 sm:flex-1">
          <div
            className={hasEntryFee ? summaryCardClass : summaryCardNoFeeClass}
          >
          {hasEntryFee ? (
            <dl className="space-y-2.5">
              <div className="flex items-baseline justify-between gap-6">
                <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                  Entrada
                </dt>
                <dd className="text-base font-semibold tabular-nums text-neutral-900">
                  {brl.format(valueCents / 100)}
                </dd>
              </div>
              {joined ? (
                <div className="flex items-baseline justify-between gap-6 border-t border-neutral-100 pt-2.5">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                    Sua inscrição
                  </dt>
                  <dd className="text-right text-sm font-semibold tabular-nums text-neutral-900">
                    {joined}
                  </dd>
                </div>
              ) : null}
              {hasMembers ? (
                <div className="border-t border-neutral-100 pt-2.5 text-right">
                  <dd className="text-sm font-semibold tabular-nums text-neutral-900">
                    {brl.format(totalCollectedCents / 100)}{' '}
                    <span className="font-normal text-neutral-400">/</span>{' '}
                    {brl.format(expectedTotalCents / 100)}
                  </dd>
                  <dd className="mt-0.5 text-[11px] text-neutral-500">
                    {paidCount} de {memberCount}{' '}
                    {memberCount === 1 ? 'pagou' : 'pagaram'}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : joined ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold leading-tight text-neutral-900">
                {POOL_NO_ENTRY_FEE_TITLE}
              </p>
              <p className="text-[11px] leading-snug text-neutral-600">
                {POOL_NO_ENTRY_FEE_EXPLAINER}
              </p>
              <div className="flex items-baseline justify-between gap-6 border-t border-neutral-100 pt-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                  Sua inscrição
                </span>
                <span className="text-right text-sm font-semibold tabular-nums text-neutral-900">
                  {joined}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold leading-tight text-neutral-900">
                {POOL_NO_ENTRY_FEE_TITLE}
              </p>
              <p className="text-[11px] leading-snug text-neutral-600">
                {POOL_NO_ENTRY_FEE_EXPLAINER}
              </p>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}

function InviteCard({ pool }: { pool: Pool }) {
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';
  const displayLink =
    (pool.inviteLink && pool.inviteLink.trim()) ||
    (origin && pool.inviteCode
      ? `${origin}/invite/${pool.inviteCode}`
      : '');

  async function copyLink() {
    if (!displayLink) return;
    try {
      await navigator.clipboard.writeText(displayLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!pool.inviteCode) return null;

  return (
    <section
      className="mb-6 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm shadow-neutral-950/5"
      aria-labelledby="invite-heading"
    >
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2
          id="invite-heading"
          className="text-sm font-semibold text-neutral-900"
        >
          Convidar participantes
        </h2>
        <span className="text-xs text-neutral-500">
          Código{' '}
          <code className="ml-0.5 rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[11px] font-medium text-neutral-700">
            {pool.inviteCode}
          </code>
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p
          className="min-w-0 flex-1 truncate rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600"
          title={displayLink || undefined}
        >
          {displayLink || 'Carregando link...'}
        </p>
        <button
          type="button"
          onClick={copyLink}
          disabled={!displayLink}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-neutral-950/10 transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {copied ? 'Copiado!' : 'Copiar link'}
        </button>
      </div>
    </section>
  );
}

export default function PoolLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const poolId = params.poolId as string;
  const router = useRouter();
  const { jwt, user, hasHydrated } = useAuthStore();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [pool, setPool] = useState<Pool | null>(null);

  /** Alinha sessão com Strapi (ex.: `documentId`) para comparar com `pool.admin`. */
  useEffect(() => {
    if (!hasHydrated || !jwt) return;
    getMe(jwt)
      .then((fresh) => setAuth(fresh, jwt))
      .catch(() => {
        /* token inválido: fluxo de login cobre outras páginas */
      });
  }, [hasHydrated, jwt, setAuth]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    Promise.all([
      apiFetch<unknown>(`/api/pools/${poolId}/session`, {}, jwt),
      apiFetch<{ data: PoolMembership[] }>(
        '/api/pools/mine/memberships',
        {},
        jwt
      ),
    ])
      .then(([sessionRes, membershipsRes]) => {
        const normalized = normalizePoolFromApi(sessionRes);
        if (!normalized) {
          router.push(MEUS_BOLOES_PATH);
          return;
        }
        if (!normalized.viewerJoinedAt) {
          const membership = (membershipsRes.data || []).find(
            (m) => m.pool.documentId === normalized.documentId
          );
          if (membership?.joinedAt) {
            normalized.viewerJoinedAt = membership.joinedAt;
          }
        }
        setPool(normalized);
      })
      .catch(() => router.push(MEUS_BOLOES_PATH));
  }, [jwt, poolId, router, hasHydrated]);

  if (!hasHydrated || !pool) return <p>Carregando...</p>;

  const isAdmin = pool.isAdmin ?? isSameUser(pool.admin, user);

  if (!jwt) return <p>Carregando...</p>;

  return (
    <PoolLayoutProvider
      poolId={poolId}
      jwt={jwt}
      pool={pool}
      setPool={setPool}
      isAdmin={isAdmin}
    >
      <div>
        <PageBreadcrumb
          segments={[{ label: 'Bolões', href: MEUS_BOLOES_PATH }]}
          label={pool.name}
          className="mb-3"
        />
        <PoolHeader pool={pool} />
        <InviteCard pool={pool} />
        <PoolNav poolId={poolId} isAdmin={isAdmin} />
        {children}
      </div>
    </PoolLayoutProvider>
  );
}
