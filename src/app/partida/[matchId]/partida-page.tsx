'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMatchDisplayNow } from '@/hooks/useMatchDisplayNow';
import { TeamFlagImage } from '@/components/TeamWithFlag/teamFlagImage';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Root as CollapsibleRoot,
  Trigger as CollapsibleTrigger,
  Content as CollapsibleContent,
} from '@radix-ui/react-collapsible';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { matchByDocumentIdPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import { showErrorToast } from '@/lib/toast';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { PartidaMatchHero } from '@/components/PartidaMatchHero/partidaMatchHero';
import type {
  Match,
  PoolMatchBetRow,
  PoolMatchBetsPayload,
  PoolMatchSection,
  Team,
} from '@/types';

const PARTIDA_PAGE_SHELL_CLASS = 'px-3 py-8';
const PARTIDA_PAGE_CARDS_CLASS = 'mx-auto w-full max-w-3xl';

function pickNullableNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function normalizePoolMatchBetsPayload(
  raw: unknown
): PoolMatchBetsPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const root = raw as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const poolsRaw = d.pools;
  if (!Array.isArray(poolsRaw)) return null;

  const pools: PoolMatchBetsPayload['pools'] = [];

  for (const p of poolsRaw) {
    if (!p || typeof p !== 'object') continue;
    const row = p as Record<string, unknown>;
    const entriesRaw = row.entries;
    const entries: PoolMatchBetRow[] = [];
    if (Array.isArray(entriesRaw)) {
      for (const e of entriesRaw) {
        if (!e || typeof e !== 'object') continue;
        const x = e as Record<string, unknown>;
        const uid = String(x.userId ?? '').trim();
        if (!uid) continue;
        entries.push({
          userId: uid,
          username: String(x.username ?? ''),
          homeScore: pickNullableNum(x.homeScore),
          awayScore: pickNullableNum(x.awayScore),
          points: pickNullableNum(x.points),
          hasBet: Boolean(x.hasBet),
          isViewer: Boolean(x.isViewer),
        });
      }
    }

    const poolDocumentId = String(row.poolDocumentId ?? '').trim();
    if (!poolDocumentId) continue;

    pools.push({
      poolDocumentId,
      poolName: String(row.poolName ?? 'Bolão'),
      entries,
    });
  }

  return {
    matchDocumentId: String(d.matchDocumentId ?? ''),
    matchStatus: String(d.matchStatus ?? 'scheduled'),
    revealed: Boolean(d.revealed),
    pools,
  };
}

function breadcrumbLabelForMatch(match: Match | null): string {
  if (!match) return 'Partida';
  const home = match.homeTeam?.name?.trim();
  const away = match.awayTeam?.name?.trim();
  if (home && away) return `${home} × ${away}`;
  return 'Partida';
}

function MiniFlag({ team }: { team: Team }) {
  const src = resolveTeamFlagUrl(team);
  const code = team.code?.trim().slice(0, 2).toUpperCase() ?? '?';
  if (!src) {
    return (
      <span
        className="inline-flex h-3.5 min-w-5 shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-100 text-[9px] font-medium text-neutral-500"
        aria-hidden
      >
        {code}
      </span>
    );
  }
  return <TeamFlagImage src={src} size="md" />;
}

function PalpiteCell({
  entry,
  revealed,
  homeTeam,
  awayTeam,
}: {
  entry: PoolMatchBetRow;
  revealed: boolean;
  homeTeam?: Team;
  awayTeam?: Team;
}) {
  const hasScores = entry.homeScore != null && entry.awayScore != null;
  if (hasScores && homeTeam && awayTeam) {
    return (
      <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
        <MiniFlag team={homeTeam} />
        <span className="tabular-nums font-medium text-neutral-900">
          {entry.homeScore}
        </span>
        <span className="text-neutral-400">×</span>
        <span className="tabular-nums font-medium text-neutral-900">
          {entry.awayScore}
        </span>
        <MiniFlag team={awayTeam} />
      </div>
    );
  }
  if (hasScores) {
    return (
      <span className="tabular-nums">
        {entry.homeScore} × {entry.awayScore}
      </span>
    );
  }
  if (!revealed && !entry.isViewer) {
    return <span className="text-neutral-500">Oculto até o jogo</span>;
  }
  if (!entry.hasBet) {
    return <span className="text-neutral-500">Sem palpite</span>;
  }
  return <span className="text-neutral-400">—</span>;
}

function PartidaPoolSection({
  section,
  match,
  revealed,
}: {
  section: PoolMatchSection;
  match: Match;
  revealed: boolean;
}) {
  const [open, setOpen] = useState(true);
  const poolTriggerId = `partida-pool-trigger-${section.poolDocumentId}`;
  const poolContentId = `partida-pool-content-${section.poolDocumentId}`;

  return (
    <CollapsibleRoot
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
    >
      <div className="border-b border-neutral-100 bg-neutral-50/80 px-3 py-2.5">
        <CollapsibleTrigger
          type="button"
          id={poolTriggerId}
          aria-controls={poolContentId}
          className="flex w-full items-center gap-2 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <h2
            id={`pool-heading-${section.poolDocumentId}`}
            className="min-w-0 flex-1 text-base font-semibold text-neutral-900"
          >
            {section.poolName}
          </h2>
          <span
            className={`material-symbols-outlined shrink-0 text-neutral-600 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            expand_more
          </span>
        </CollapsibleTrigger>
        <Link
          href={`/pool/${encodeURIComponent(section.poolDocumentId)}/ranking`}
          className="mt-1 inline-block text-xs font-medium text-emerald-800 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-950"
        >
          Ver ranking completo
        </Link>
      </div>

      <CollapsibleContent id={poolContentId} aria-labelledby={poolTriggerId}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-70 text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500 uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">Participante</th>
                <th className="px-3 py-2 font-medium text-center">Palpite</th>
                <th className="px-3 py-2 font-medium text-center w-16">Pts</th>
              </tr>
            </thead>
            <tbody>
              {section.entries.map((entry) => (
                <tr
                  key={`${section.poolDocumentId}-${entry.userId}`}
                  className="border-b border-neutral-50 last:border-0 odd:bg-white even:bg-neutral-50/40"
                >
                  <td className="px-3 py-2">
                    <span className="flex flex-wrap items-center gap-1.5">
                      {entry.isViewer ? (
                        <span className="font-medium text-neutral-900">
                          {entry.username}
                          <span className="ml-1 text-xs font-normal text-emerald-700">
                            (você)
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={`/user/${encodeURIComponent(entry.username)}`}
                          className="font-medium text-neutral-900 underline decoration-neutral-200 underline-offset-2 hover:text-emerald-900 hover:decoration-emerald-400"
                        >
                          {entry.username}
                        </Link>
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-neutral-800">
                    <PalpiteCell
                      entry={entry}
                      revealed={revealed}
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                    />
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums text-neutral-600">
                    {entry.points != null ? (
                      <span
                        className={
                          entry.points === 0
                            ? 'text-red-600 font-medium'
                            : 'text-green-700 font-medium'
                        }
                      >
                        {entry.points === 0 ? '0' : `+${entry.points}`}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

export default function PartidaPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { jwt, hasHydrated } = useAuthStore();
  const [match, setMatch] = useState<Match | null>(null);
  const [poolData, setPoolData] = useState<PoolMatchBetsPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const displayMatches = useMemo(() => (match ? [match] : []), [match]);
  const displayNow = useMatchDisplayNow(displayMatches);

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

    const matchUrl = matchByDocumentIdPath(matchId);
    const betsUrl = `/api/pools/match/${encodeURIComponent(matchId)}/bets`;

    Promise.all([
      apiFetch<unknown>(matchUrl, {}, jwt),
      apiFetch<unknown>(betsUrl, {}, jwt),
    ])
      .then(([matchPayload, poolApiPayload]) => {
        const matches = normalizeMatchesPayload(matchPayload);
        const m = matches[0] ?? null;
        setMatch(m);

        setPoolData(normalizePoolMatchBetsPayload(poolApiPayload));
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Erro ao carregar';
        setLoadError(msg);
        showErrorToast(msg);
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, jwt, matchId, router]);

  if (!hasHydrated || !jwt) {
    return (
      <div className={PARTIDA_PAGE_SHELL_CLASS}>
        <PageBreadcrumb label="Partida" className="mb-3" />
        <p className="text-sm text-neutral-600">Carregando...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={PARTIDA_PAGE_SHELL_CLASS}>
        <PageBreadcrumb label="Partida" className="mb-3" />
        <p className="text-sm text-neutral-600">Carregando partida...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className={PARTIDA_PAGE_SHELL_CLASS}>
        <PageBreadcrumb label="Partida" className="mb-3" />
        <p className="text-sm text-red-600" role="alert">
          Partida não encontrada.
        </p>
        {loadError ? (
          <p className="text-sm text-neutral-600 mt-2">{loadError}</p>
        ) : null}
      </div>
    );
  }

  const revealed = poolData?.revealed ?? false;

  return (
    <div className={PARTIDA_PAGE_SHELL_CLASS}>
      <PageBreadcrumb label={breadcrumbLabelForMatch(match)} className="mb-3" />

      <div className={PARTIDA_PAGE_CARDS_CLASS}>
        {loadError ? (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="mb-8">
          <PartidaMatchHero match={match} displayNow={displayNow} />
        </div>

        {!poolData || poolData.pools.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-700">
            <p className="mb-3">
              Você ainda não participa de nenhum bolão. Entre em um bolão para
              ver os palpites dos outros nesta partida, agrupados por bolão.
            </p>
            <Link
              href={MEUS_BOLOES_PATH}
              className="font-semibold text-emerald-800 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-950"
            >
              Meus bolões
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {poolData.pools.map((section) => (
              <PartidaPoolSection
                key={section.poolDocumentId}
                section={section}
                match={match}
                revealed={revealed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
