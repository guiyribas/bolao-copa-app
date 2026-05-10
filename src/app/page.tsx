'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Root as TabsRoot,
  List as TabsList,
  Trigger as TabsTrigger,
  Content as TabsContent,
} from '@radix-ui/react-tabs';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { matchesListPath } from '@/lib/matches-query';
import { standingsFromGroupMatches } from '@/lib/standings-from-matches';
import { isKnockoutPhase, GROUP_PHASE } from '@/lib/match-phases';
import { HOME_TAB_QUERY_KEY, MEUS_BOLOES_PATH } from '@/lib/navigation';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { FixtureMatchRow } from '@/components/FixtureMatchRow/fixtureMatchRow';
import { GroupTable } from '@/components/GroupTable/groupTable';
import { KnockoutBracket } from '@/components/KnockoutBracket/knockoutBracket';
import {
  formatLocalDateLong,
  isSameLocalCalendarDay,
} from '@/components/MatchCard/matchCard.utils';
import { normalizeMatchesPayload } from '@/lib/match-status';
import type { Match } from '@/types';

const HOME_TAB_VALUES = ['all', 'today', 'groups', 'knockout'] as const;

const homeTabParser = parseAsStringLiteral(HOME_TAB_VALUES).withDefault('all');

const TAB_TRIGGER_CLASS = twMerge(
  'text-sm px-3 py-2 rounded-t-md border border-b-0 border-slate-200/90 transition-colors',
  'data-[state=active]:border-yellow-400/50 data-[state=active]:bg-linear-to-b data-[state=active]:from-emerald-900 data-[state=active]:to-emerald-950',
  'data-[state=active]:text-yellow-50 data-[state=active]:shadow-[inset_0_-2px_0_rgba(234,179,8,0.4)]',
  'data-[state=inactive]:bg-white/90 data-[state=inactive]:text-slate-700 data-[state=inactive]:hover:bg-emerald-50/90',
  'outline-none focus-visible:ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-white'
);

export default function HomePage() {
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();
  const [homeTab, setHomeTab] = useQueryState(HOME_TAB_QUERY_KEY, homeTabParser);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    apiFetch<unknown>(matchesListPath(undefined), {}, jwt)
      .then((raw) => {
        setMatches(normalizeMatchesPayload(raw));
        setMatchesError(null);
      })
      .catch((e) => {
        setMatches([]);
        setMatchesError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setMatchesLoading(false));
  }, [jwt, router, hasHydrated]);

  const sortedAllMatches = useMemo(
    () =>
      [...matches].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [matches]
  );

  const knockoutMatches = useMemo(
    () => sortedAllMatches.filter((m) => isKnockoutPhase(m.phase)),
    [sortedAllMatches]
  );

  const todayMatches = useMemo(
    () => sortedAllMatches.filter((m) => isSameLocalCalendarDay(m.date)),
    [sortedAllMatches]
  );

  const groupMatches = useMemo(
    () => sortedAllMatches.filter((m) => m.phase === GROUP_PHASE),
    [sortedAllMatches]
  );

  const groupStandings = useMemo(
    () => standingsFromGroupMatches(matches),
    [matches]
  );
  const groupKeysSorted = useMemo(
    () => Object.keys(groupStandings).sort(),
    [groupStandings]
  );

  if (!hasHydrated) return <p>Carregando...</p>;
  if (!jwt) return null;

  return (
    <div className="space-y-8">
      <section aria-labelledby="copa-real-heading" className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/95 via-white to-amber-50/40 px-5 py-6 shadow-[0_12px_40px_-24px_rgba(6,78,59,0.22)] md:px-8 md:py-8">
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-linear-to-br from-emerald-600/22 via-transparent to-emerald-400/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-linear-to-tr from-amber-400/18 to-transparent blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-8 right-10 h-32 w-32 rounded-full bg-linear-to-tr from-yellow-400/14 to-transparent blur-3xl md:right-24"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-xl space-y-3">
              <h1
                id="copa-real-heading"
                className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
              >
                Copa do Mundo da FIFA 2026™
              </h1>
              <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">
                Resultados reais
              </p>
            </div>
            <Link
              href={MEUS_BOLOES_PATH}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-emerald-800 via-emerald-900 to-emerald-950 px-4 py-2.5 text-sm font-semibold text-yellow-50 shadow-lg shadow-emerald-950/25 transition hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Bolões
            </Link>
          </div>
        </div>

        <TabsRoot
          value={homeTab}
          onValueChange={(v) =>
            void setHomeTab(v as (typeof HOME_TAB_VALUES)[number])
          }
          className="w-full"
        >
          <TabsList
            className="flex flex-wrap gap-1 border-b border-slate-200/95 mb-4"
            aria-label="Filtrar por fase"
          >
            <TabsTrigger value="all" className={TAB_TRIGGER_CLASS}>
              Todas as partidas
            </TabsTrigger>
            <TabsTrigger value="today" className={TAB_TRIGGER_CLASS}>
              Partidas de hoje
            </TabsTrigger>
            <TabsTrigger value="groups" className={TAB_TRIGGER_CLASS}>
              Classificação
            </TabsTrigger>
            <TabsTrigger value="knockout" className={TAB_TRIGGER_CLASS}>
              Mata-mata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="outline-none">
            {matchesLoading ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : matchesError ? (
              <p className="text-sm text-red-600" role="alert">
                Não foi possível carregar as partidas: {matchesError}
              </p>
            ) : sortedAllMatches.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhuma partida cadastrada.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {sortedAllMatches.map((m) => (
                  <FixtureMatchRow key={m.documentId} match={m} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="outline-none">
            {matchesLoading ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : matchesError ? (
              <p className="text-sm text-red-600" role="alert">
                Não foi possível carregar as partidas: {matchesError}
              </p>
            ) : todayMatches.length === 0 ? (
              <p className="text-sm text-neutral-600">
                Nenhuma partida hoje (
                <span className="text-neutral-500">
                  {formatLocalDateLong()}
                </span>
                )
              </p>
            ) : (
              <>
                <p className="text-xs text-neutral-500 mb-3 capitalize">
                  {formatLocalDateLong()}
                </p>
                <div className="flex flex-col gap-2">
                  {todayMatches.map((m) => (
                    <FixtureMatchRow key={m.documentId} match={m} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="groups" className="outline-none space-y-6">
            {matchesLoading ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : matchesError ? (
              <p className="text-sm text-red-600" role="alert">
                Não foi possível carregar as partidas: {matchesError}
              </p>
            ) : (
              <>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 mb-2">
                    Classificação (grupos)
                  </h2>
                  {groupKeysSorted.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                      Ainda não há partidas na fase de grupos cadastradas.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupKeysSorted.map((gk) => (
                        <GroupTable
                          key={gk}
                          group={gk}
                          standings={groupStandings[gk]}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-neutral-800 mb-2">
                    Calendário da fase de grupos
                  </h2>
                  {groupMatches.length === 0 ? (
                    <p className="text-sm text-neutral-500">
                      Sem jogos de grupo nesta lista.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {groupMatches.map((m) => (
                        <FixtureMatchRow key={m.documentId} match={m} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="knockout" className="outline-none">
            {matchesLoading ? (
              <p className="text-sm text-neutral-500">Carregando...</p>
            ) : matchesError ? (
              <p className="text-sm text-red-600" role="alert">
                Não foi possível carregar as partidas: {matchesError}
              </p>
            ) : (
              <KnockoutBracket matches={knockoutMatches} />
            )}
          </TabsContent>
        </TabsRoot>
      </section>
    </div>
  );
}
