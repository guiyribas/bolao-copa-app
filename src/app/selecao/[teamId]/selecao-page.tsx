'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { getFifaRankingForTeam } from '@/lib/fifa-team-ranking';
import { matchesListPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import {
  findTeamInMatches,
  groupMatchesByLocalDay,
  matchesForTeam,
} from '@/lib/team-matches';
import { useMatchDisplayNow } from '@/hooks/useMatchDisplayNow';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { FixtureMatchRow } from '@/components/FixtureMatchRow/fixtureMatchRow';
import { TeamSelectionHero } from '@/components/TeamSelectionHero/teamSelectionHero';
import type { Match, Team } from '@/types';

const FIXTURES_LIST_CLASS = 'flex flex-col gap-2';

export default function SelecaoPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const { jwt, hasHydrated } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const displayNow = useMatchDisplayNow(matches);

  useEffect(() => {
    if (!hasHydrated) return;
    void Promise.resolve().then(() => setMatchesLoading(true));
    apiFetch<unknown>(matchesListPath(undefined), {}, jwt ?? null)
      .then((raw) => {
        setMatches(normalizeMatchesPayload(raw));
        setMatchesError(null);
      })
      .catch((e) => {
        setMatches([]);
        setMatchesError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => setMatchesLoading(false));
  }, [jwt, hasHydrated]);

  const team = useMemo<Team | null>(
    () => findTeamInMatches(matches, teamId),
    [matches, teamId]
  );

  const teamMatches = useMemo(
    () => matchesForTeam(matches, teamId),
    [matches, teamId]
  );

  const teamMatchesByDay = useMemo(
    () => groupMatchesByLocalDay(teamMatches),
    [teamMatches]
  );

  const fifaRanking = useMemo(() => getFifaRankingForTeam(team), [team]);

  if (!hasHydrated) return <p>Carregando...</p>;

  const breadcrumbLabel = team?.name?.trim() || team?.code?.trim() || 'Seleção';
  const showPalpitesLink = Boolean(jwt);

  return (
    <div className="space-y-8">
      <PageBreadcrumb label={breadcrumbLabel} />

      {matchesLoading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : matchesError ? (
        <p className="text-sm text-red-600" role="alert">
          Não foi possível carregar as partidas: {matchesError}
        </p>
      ) : !team ? (
        <p className="text-sm text-neutral-600">
          Seleção não encontrada nas partidas cadastradas.
        </p>
      ) : (
        <>
          <TeamSelectionHero team={team} fifaRanking={fifaRanking} />

          <section aria-labelledby="selecao-fixtures-heading" className="space-y-6">
            <h2
              id="selecao-fixtures-heading"
              className="text-lg font-semibold tracking-tight text-slate-900"
            >
              Partidas
            </h2>

            {teamMatches.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Nenhuma partida cadastrada para esta seleção.
              </p>
            ) : (
              <div className="space-y-6">
                {teamMatchesByDay.map(({ dayKey, label, matches: dayMatches }) => (
                  <section
                    key={dayKey}
                    aria-labelledby={`selecao-match-day-${dayKey}`}
                    className="space-y-2"
                  >
                    <h3
                      id={`selecao-match-day-${dayKey}`}
                      className="text-xs font-semibold capitalize text-slate-600"
                    >
                      {label}
                    </h3>
                    <div className={FIXTURES_LIST_CLASS}>
                      {dayMatches.map((m) => (
                        <FixtureMatchRow
                          key={m.documentId}
                          match={m}
                          showPalpitesLink={showPalpitesLink}
                          displayNow={displayNow}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
