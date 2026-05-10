'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Root as CollapsibleRoot,
  Trigger as CollapsibleTrigger,
  Content as CollapsibleContent,
} from '@radix-ui/react-collapsible';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { showErrorToast } from '@/lib/toast';
import { GROUP_PHASE } from '@/lib/match-phases';
import { matchesListPath } from '@/lib/matches-query';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';
import { MatchCard } from '@/components/MatchCard/matchCard';
import { FilterPill } from '@/components/FilterPill/filterPill';
import { GroupTable } from '@/components/GroupTable/groupTable';
import type { Match, Bet, TeamStanding } from '@/types';
import { useQueryState } from 'nuqs';

const PHASES = [
  { value: '', label: 'Todas' },
  { value: 'group', label: 'Grupos' },
  { value: 'round_of_32', label: 'Segunda fase' },
  { value: 'round_of_16', label: 'Oitavas' },
  { value: 'quarter', label: 'Quartas' },
  { value: 'semi', label: 'Semi' },
  { value: 'third_place', label: '3º lugar' },
  { value: 'final', label: 'Final' },
];

/** Brasil: grupo da Copa configurado como padrão na aba Palpites. */
const DEFAULT_GROUP_FILTER = 'C';

function getMatchGroupKey(m: Match): string | undefined {
  const g = m.group ?? m.homeTeam?.group;
  if (g == null || String(g).trim() === '') return undefined;
  return String(g).trim();
}

function buildTeamFlagLookup(matches: Match[]): Map<string, string | null> {
  const map = new Map<string, string | null>();
  for (const m of matches) {
    for (const t of [m.homeTeam, m.awayTeam]) {
      if (t?.documentId && !map.has(t.documentId)) {
        map.set(t.documentId, resolveTeamFlagUrl(t));
      }
    }
  }
  return map;
}

function enrichStandingsFlags(
  rows: TeamStanding[],
  lookup: Map<string, string | null>
): TeamStanding[] {
  return rows.map((r) => {
    const fromMatch = lookup.get(r.teamId);
    const fromApi = r.flagUrl?.trim() ? r.flagUrl : null;
    return {
      ...r,
      flagUrl: fromApi ?? fromMatch ?? null,
    };
  });
}

export default function PalpitesPage() {
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();

  const [phase, setPhase] = useQueryState('phase', { defaultValue: '' });
  const [groupFilter, setGroupFilter] = useQueryState('group', {
    defaultValue: DEFAULT_GROUP_FILTER,
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [groups, setGroups] = useState<Record<string, TeamStanding[]>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [partidasOpen, setPartidasOpen] = useState(true);
  const [simulacaoOpen, setSimulacaoOpen] = useState(true);

  const showGroupSimulation =
    phase === '' || phase === GROUP_PHASE;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    // Reset refetch UX (phase/filter); eslint disallows synchronous setState in effects.
    void Promise.resolve().then(() => {
      setLoading(true);
      setLoadError(null);
    });

    const normalizeList = <T,>(payload: unknown): T[] => {
      if (
        payload &&
        typeof payload === 'object' &&
        Array.isArray((payload as { data?: unknown }).data)
      ) {
        return (payload as { data: T[] }).data;
      }
      return [];
    };

    const requests: [
      Promise<unknown>,
      Promise<{ data: Bet[] }>,
      Promise<{ data: Record<string, TeamStanding[]> }>?,
    ] = [
      apiFetch<unknown>(matchesListPath(phase || undefined), {}, jwt),
      apiFetch<{ data: Bet[] }>(`/api/bets/my-bets`, {}, jwt),
    ];
    if (showGroupSimulation) {
      requests.push(
        apiFetch<{ data: Record<string, TeamStanding[]> }>(
          `/api/bets/group-simulation`,
          {},
          jwt
        )
      );
    }

    Promise.allSettled(requests)
      .then((results) => {
        const mRes = results[0];
        const bRes = results[1];
        const gRes = results[2];

        if (mRes.status === 'fulfilled') {
          setMatches(normalizeList<Match>(mRes.value));
        } else {
          setMatches([]);
          const msg =
            mRes.reason instanceof Error ? mRes.reason.message : String(mRes.reason);
          setLoadError((prev) => prev ?? msg);
          console.error('Falha ao carregar partidas:', mRes.reason);
        }

        if (bRes.status === 'fulfilled') {
          setBets(normalizeList<Bet>(bRes.value));
        } else {
          setBets([]);
          console.error('Falha ao carregar palpites:', bRes.reason);
        }

        if (showGroupSimulation && gRes) {
          if (gRes.status === 'fulfilled') {
            setGroups(gRes.value?.data ?? {});
          } else {
            setGroups({});
            console.error('Falha na simulação de grupos:', gRes.reason);
          }
        } else if (!showGroupSimulation) {
          setGroups({});
        }
      })
      .finally(() => setLoading(false));
  }, [jwt, phase, hasHydrated, router, showGroupSimulation]);

  async function saveBet(matchId: string, homeScore: number, awayScore: number) {
    if (!jwt) return;
    try {
      await apiFetch(
        '/api/bets',
        {
          method: 'POST',
          body: JSON.stringify({
            data: { match: matchId, homeScore, awayScore },
          }),
        },
        jwt
      );

      const betRes = await apiFetch<{ data: Bet[] }>(`/api/bets/my-bets`, {}, jwt);
      setBets(betRes.data || []);
      if (showGroupSimulation) {
        const groupRes = await apiFetch<{ data: Record<string, TeamStanding[]> }>(
          `/api/bets/group-simulation`,
          {},
          jwt
        );
        setGroups(groupRes.data || {});
      }
    } catch (e) {
      showErrorToast(e, 'Não foi possível salvar o palpite.');
    }
  }

  const activeGroupKey =
    phase === GROUP_PHASE ? groupFilter || DEFAULT_GROUP_FILTER : null;

  const teamFlagLookup = useMemo(() => buildTeamFlagLookup(matches), [matches]);

  const sortedGroupsKeys = useMemo(() => Object.keys(groups).sort(), [groups]);

  const simulationGroupKeys = useMemo(() => {
    if (phase === GROUP_PHASE && activeGroupKey) {
      return sortedGroupsKeys.filter((g) => g === activeGroupKey);
    }
    return sortedGroupsKeys;
  }, [phase, activeGroupKey, sortedGroupsKeys]);

  if (!hasHydrated || !jwt) return <p>Carregando...</p>;
  if (loading) return <p>Carregando partidas...</p>;

  const matchGroupKeys = [
    ...new Set(
      matches
        .map(getMatchGroupKey)
        .filter((k): k is string => Boolean(k))
    ),
  ].sort();

  const displayMatches =
    phase === GROUP_PHASE && activeGroupKey
      ? matches.filter((m) => getMatchGroupKey(m) === activeGroupKey)
      : matches;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Palpites</h1>
      <p className="text-sm text-gray-600 mb-4">
        Um palpite por partida vale para todos os bolões em que você participa.
      </p>

      {loadError && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          Não foi possível carregar as partidas: {loadError}
        </p>
      )}

      <CollapsibleRoot
        open={partidasOpen}
        onOpenChange={setPartidasOpen}
        className="mb-4 rounded-lg border border-neutral-200 bg-white shadow-sm"
      >
        <CollapsibleTrigger
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-t-lg border-b border-neutral-100 data-[state=closed]:rounded-lg data-[state=open]:border-b"
          aria-controls="palpites-partidas-content"
          id="palpites-partidas-trigger"
        >
          <span className="text-base font-semibold text-neutral-900">Partidas</span>
          <span
            className={`material-symbols-outlined shrink-0 text-neutral-600 transition-transform duration-200 ${
              partidasOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            expand_more
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent id="palpites-partidas-content" aria-labelledby="palpites-partidas-trigger">
          <div className="px-3 pb-4 pt-3">
            <div className="flex gap-2 mb-4 flex-wrap">
              {PHASES.map((p) => (
                <FilterPill
                  key={p.value}
                  selected={phase === p.value}
                  onClick={() => {
                    void setPhase(p.value || null);
                    if (p.value !== GROUP_PHASE) void setGroupFilter(null);
                  }}
                >
                  {p.label}
                </FilterPill>
              ))}
            </div>

            {phase === GROUP_PHASE && matchGroupKeys.length > 0 ? (
              <div className="flex gap-2 mb-4 flex-wrap">
                {matchGroupKeys.map((g) => (
                  <FilterPill
                    key={g}
                    selected={(groupFilter || DEFAULT_GROUP_FILTER) === g}
                    onClick={() => void setGroupFilter(g)}
                    aria-label={`Filtrar grupo ${g}`}
                  >
                    Grupo {g}
                  </FilterPill>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              {displayMatches.map((match) => {
                const bet = bets.find(
                  (b) => b.match?.documentId === match.documentId
                );
                return (
                  <MatchCard
                    key={`${match.documentId}-${bet?.documentId ?? 'none'}-${bet?.homeScore ?? ''}-${bet?.awayScore ?? ''}`}
                    match={match}
                    bet={bet}
                    onSave={(h, a) => saveBet(match.documentId, h, a)}
                  />
                );
              })}
              {displayMatches.length === 0 && (
                <p className="text-gray-500">Nenhuma partida encontrada.</p>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>

      {showGroupSimulation ? (
        <CollapsibleRoot
          open={simulacaoOpen}
          onOpenChange={setSimulacaoOpen}
          className="rounded-lg border border-neutral-200 bg-white shadow-sm"
        >
          <CollapsibleTrigger
            type="button"
            className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-t-lg border-b border-neutral-100 data-[state=closed]:rounded-lg data-[state=open]:border-b"
            aria-controls="palpites-simulacao-content"
            id="palpites-simulacao-trigger"
          >
            <span className="text-base font-semibold text-neutral-900">Simulação dos grupos</span>
            <span
              className={`material-symbols-outlined shrink-0 text-neutral-600 transition-transform duration-200 ${
                simulacaoOpen ? 'rotate-180' : ''
              }`}
              aria-hidden
            >
              expand_more
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent id="palpites-simulacao-content" aria-labelledby="palpites-simulacao-trigger">
            <section className="px-3 pb-4 pt-3" aria-labelledby="palpites-simulacao-trigger">
              <p className="text-xs text-gray-500 mb-4">
                {simulationGroupKeys.length === 1
                  ? 'Tabela calculada com base nos seus palpites'
                  : 'Tabelas calculadas com base nos seus palpites'}
              </p>
              {simulationGroupKeys.length === 0 ? (
                <p className="text-gray-500">
                  {sortedGroupsKeys.length === 0
                    ? 'Nenhuma seleção cadastrada ainda.'
                    : 'Sem tabela de simulação para o grupo selecionado.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simulationGroupKeys.map((group) => (
                    <GroupTable
                      key={group}
                      group={group}
                      standings={enrichStandingsFlags(groups[group], teamFlagLookup)}
                    />
                  ))}
                </div>
              )}
            </section>
          </CollapsibleContent>
        </CollapsibleRoot>
      ) : null}
    </div>
  );
}
