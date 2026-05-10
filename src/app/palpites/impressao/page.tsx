'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { GROUP_PHASE } from '@/lib/match-phases';
import { matchesListPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import type { Bet, Match } from '@/types';

function normalizeList<T>(payload: unknown): T[] {
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

function compactPhase(match: Match): string {
  if (match.phase === GROUP_PHASE) {
    const g = match.group ?? match.homeTeam?.group;
    return g ? `Grupo ${g}` : 'Grupos';
  }
  const labels: Record<string, string> = {
    round_of_32: 'Segunda fase',
    round_of_16: 'Oitavas',
    quarter: 'Quartas',
    semi: 'Semi',
    third_place: '3o',
    final: 'Final',
  };
  return labels[match.phase] ?? match.phase;
}

function formatScorepair(home: number, away: number): string {
  return `${home}–${away}`;
}

export default function PalpitesImpressaoPage() {
  const router = useRouter();
  const { jwt, user, hasHydrated } = useAuthStore();

  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    void Promise.resolve().then(() => {
      setLoading(true);
      setLoadError(null);
    });

    const pageSize = 100;
    const betsPromise = apiFetch<{ data: Bet[] }>(`/api/bets/my-bets`, {}, jwt);

    (async () => {
      const allMatches: Match[] = [];
      let matchesErr: unknown;
      try {
        for (let page = 1; page <= 30; page += 1) {
          const payload = await apiFetch<unknown>(
            matchesListPath(undefined, { page, pageSize }),
            {},
            jwt
          );
          const batch = normalizeMatchesPayload(payload);
          allMatches.push(...batch);
          if (batch.length < pageSize) break;
        }
      } catch (e) {
        matchesErr = e;
        console.error('Falha ao carregar partidas:', e);
      }

      let betsPayload: { data: Bet[] } | unknown = null;
      try {
        betsPayload = await betsPromise;
      } catch (e) {
        console.error('Falha ao carregar palpites:', e);
      }

      const seen = new Set<string>();
      const deduped: Match[] = [];
      if (!matchesErr) {
        for (const m of allMatches) {
          if (seen.has(m.documentId)) continue;
          seen.add(m.documentId);
          deduped.push(m);
        }
      }

      if (matchesErr) {
        setMatches([]);
        const msg =
          matchesErr instanceof Error ? matchesErr.message : String(matchesErr);
        setLoadError((prev) => prev ?? msg);
      } else {
        setMatches(deduped);
      }

      setBets(betsPayload != null ? normalizeList<Bet>(betsPayload) : []);
      setLoading(false);
    })().catch(() => setLoading(false));
  }, [jwt, hasHydrated, router]);

  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches]
  );

  if (!hasHydrated || !jwt) {
    return (
      <div>
        <PageBreadcrumb label="Impressão de palpites" className="mb-3" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageBreadcrumb label="Impressão de palpites" className="mb-3" />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb label="Impressão de palpites" className="mb-3 print:hidden" />

      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <Link
          href="/palpites"
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Voltar aos palpites
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white outline-none hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden>
            print
          </span>
          Imprimir
        </button>
      </div>

      {loadError && (
        <p className="mb-4 text-sm text-red-600 print:hidden" role="alert">
          Não foi possível carregar as partidas: {loadError}
        </p>
      )}

      <header className="mb-3 print:mb-2">
        <h1 className="text-lg font-bold text-neutral-900 print:text-[11pt] print:leading-tight">
          Meus palpites · Bolão Copa 2026
        </h1>
        <p className="text-xs text-neutral-600 print:text-[8pt] print:leading-tight">
          {user?.username ? `@${user.username} · ` : null}
          {sortedMatches.length} partida{sortedMatches.length === 1 ? '' : 's'}
        </p>
      </header>

      {sortedMatches.length === 0 ? (
        <p className="text-neutral-600">Nenhuma partida cadastrada.</p>
      ) : (
        <div
          className="columns-1 gap-x-3 text-xs text-neutral-900 sm:columns-2 print:columns-3 print:gap-x-[3.5mm] print:text-[7.5pt] print:leading-snug"
        >
          {sortedMatches.map((match) => {
            const bet = bets.find((b) => b.match?.documentId === match.documentId);
            const pred =
              bet != null
                ? formatScorepair(bet.homeScore, bet.awayScore)
                : '—';

            const homeCode = match.homeTeam?.code ?? '?';
            const awayCode = match.awayTeam?.code ?? '?';

            return (
              <div
                key={match.documentId}
                className="break-inside-avoid border-b border-neutral-200/90 py-2 pr-1 sm:py-2.5 print:border-neutral-400 print:py-[0.45rem] print:pr-0.5"
              >
                <div className="flex flex-wrap gap-x-1.5 gap-y-1 tabular-nums">
                  <span className="shrink-0 text-neutral-500 print:text-neutral-700">
                    {formatMatchDate(match.date)}
                  </span>
                  <span className="shrink-0 font-medium text-neutral-600 print:text-neutral-800">
                    {compactPhase(match)}
                  </span>
                  <span className="min-w-0 font-medium">
                    {homeCode}{' '}
                    <span className="text-neutral-800">{pred}</span> {awayCode}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
