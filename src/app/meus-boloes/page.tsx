'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { saveBtn } from '@/components/MatchCard/matchCard.styles';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { twMerge } from 'tailwind-merge';
import type { PoolMembership } from '@/types';

function formatJoinedPtBr(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function MeusBoloesPage() {
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();
  const [memberships, setMemberships] = useState<PoolMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    apiFetch<{ data: PoolMembership[] }>('/api/pools/mine/memberships', {}, jwt)
      .then((res) => setMemberships(res.data || []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [jwt, router, hasHydrated]);

  if (!hasHydrated) return <p>Carregando...</p>;
  if (!jwt) return null;

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="meus-boloes-heading"
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
          <PageBreadcrumb label="Bolões" className="mb-0 opacity-90" />
          <h1
            id="meus-boloes-heading"
            className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
          >
            Meus bolões
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
            Os bolões em que você está inscrito. Calendário, jogos e placar
            oficial continuam na{' '}
            <Link
              href="/"
              className="font-medium text-emerald-800 underline decoration-emerald-300/90 underline-offset-2 transition hover:text-emerald-950 hover:decoration-emerald-700"
            >
              página inicial
            </Link>
            .
          </p>
        </div>
      </section>

      {loading ? (
        <div
          className="rounded-xl border border-slate-200/90 bg-white/70 px-5 py-8 text-center text-sm text-slate-500 shadow-sm"
          role="status"
          aria-live="polite"
        >
          Carregando seus bolões…
        </div>
      ) : memberships.length === 0 ? (
        <div className="rounded-xl border border-dashed border-emerald-200/90 bg-linear-to-br from-emerald-50/50 to-white px-6 py-10 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/90 text-emerald-800 shadow-inner shadow-emerald-900/5">
            <EmojiEventsOutlinedIcon sx={{ fontSize: 28 }} aria-hidden />
          </div>
          <p className="text-[15px] font-medium text-slate-800">
            Você ainda não está em nenhum bolão
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            Peça um convite ao administrador ou aceite um link para entrar —
            aqui vai aparecer cada bolão com acesso rápido ao ranking.
          </p>
        </div>
      ) : (
        <ul
          className="grid list-none gap-4 p-0 sm:grid-cols-2"
          aria-label="Lista de bolões"
        >
          {memberships.map((m) => {
            const joined = formatJoinedPtBr(m.joinedAt);
            const rankingTotal = m.rankingTotal ?? 0;
            const showRanking = rankingTotal > 0;
            const rankFraction = showRanking ? (
              <span className="font-medium tabular-nums text-slate-700">
                {m.rankingPlace != null ? m.rankingPlace : '–'}/{rankingTotal}
              </span>
            ) : null;
            return (
              <li key={m.documentId}>
                <Link
                  href={`/pool/${m.pool.documentId}/ranking`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[0_8px_28px_-18px_rgba(15,23,42,0.18)] transition hover:border-emerald-300/80 hover:shadow-[0_16px_40px_-22px_rgba(6,78,59,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-700 to-emerald-900 text-amber-100 shadow-md shadow-emerald-950/20 transition group-hover:from-emerald-600 group-hover:to-emerald-800"
                      aria-hidden
                    >
                      <EmojiEventsOutlinedIcon sx={{ fontSize: 26 }} />
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-emerald-950">
                        {m.pool.name}
                      </p>
                      {(joined || showRanking) && (
                        <p className="text-sm text-slate-600">
                          {joined ? (
                            <>
                              Desde {joined}
                              {showRanking ? (
                                <>
                                  {' '}
                                  <span aria-hidden>·</span> {rankFraction}
                                </>
                              ) : null}
                            </>
                          ) : (
                            rankFraction
                          )}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={
                            m.hasPaid
                              ? 'inline-flex items-center rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900'
                              : 'inline-flex items-center rounded-full border border-amber-200/90 bg-amber-50/95 px-2.5 py-0.5 text-xs font-semibold text-amber-900'
                          }
                        >
                          {m.hasPaid
                            ? 'Pagamento efetuado'
                            : 'Pagamento pendente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 justify-stretch sm:justify-end">
                    <span
                      className={twMerge(
                        saveBtn,
                        'gap-1 group-hover:bg-emerald-700'
                      )}
                    >
                      Ver ranking
                      <ChevronRightIcon sx={{ fontSize: 20 }} aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
