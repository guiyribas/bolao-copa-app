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
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import { FixtureMatchRow } from '@/components/FixtureMatchRow/fixtureMatchRow';
import { GroupTable } from '@/components/GroupTable/groupTable';
import { KnockoutBracket } from '@/components/KnockoutBracket/knockoutBracket';
import {
  formatLocalDateLong,
  isSameLocalCalendarDay,
} from '@/components/MatchCard/matchCard.utils';
import type { Match } from '@/types';

const TAB_TRIGGER_CLASS = twMerge(
  'text-sm px-3 py-2 rounded-t-md border border-b-0 border-neutral-200',
  'data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-neutral-50',
  'data-[state=inactive]:hover:bg-neutral-100 outline-none focus-visible:ring-2 ring-offset-2 ring-neutral-900'
);

function normalizeMatchList(payload: unknown): Match[] {
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Match[] }).data;
  }
  return [];
}

export default function HomePage() {
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();
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
        setMatches(normalizeMatchList(raw));
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
    <div>
      <section aria-labelledby="copa-real-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h1 id="copa-real-heading" className="text-xl font-bold">
              Copa 2026: placar oficial
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              Resultados reais atualizados no sistema (manual ou por API
              depois).
            </p>
          </div>
          <Link
            href={MEUS_BOLOES_PATH}
            className="text-sm underline text-neutral-800 shrink-0"
          >
            Meus bolões
          </Link>
        </div>

        <TabsRoot defaultValue="all" className="w-full">
          <TabsList
            className="flex flex-wrap gap-1 border-b border-neutral-200 mb-4"
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
