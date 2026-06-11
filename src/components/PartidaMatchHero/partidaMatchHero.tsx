'use client';

import { twMerge } from 'tailwind-merge';
import type { Match } from '@/types';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { LiveBroadcastDot } from '@/components/LiveBroadcastDot/liveBroadcastDot';
import {
  liveFrame,
  liveFramePing,
} from '@/components/LiveBroadcastDot/liveBroadcast.styles';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import {
  getEffectiveMatchStatus,
  resolveDisplayScores,
} from '@/lib/match-display';
import { useDisplayNow } from '@/hooks/useDisplayNow';
import { selecaoPath } from '@/lib/navigation';

function phaseLabel(phase: string): string {
  const m: Record<string, string> = {
    group: 'Grupos',
    round_of_32: 'Segunda fase',
    round_of_16: 'Oitavas',
    quarter: 'Quartas',
    semi: 'Semifinal',
    third_place: '3º lugar',
    final: 'Final',
  };
  return m[phase] ?? phase;
}

function statusChip(status: Match['status']): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'live':
      return {
        label: 'Ao vivo',
        className:
          'border-green-600/40 bg-green-50 text-green-900 ring-1 ring-green-600/20',
      };
    case 'finished':
      return {
        label: 'Encerrada',
        className:
          'border-neutral-300 bg-neutral-100/90 text-neutral-700 ring-1 ring-neutral-200/80',
      };
    default:
      return {
        label: 'Agendada',
        className:
          'border-amber-300/60 bg-amber-50 text-amber-950 ring-1 ring-amber-400/25',
      };
  }
}

function matchHeadingTitle(match: Match): string {
  const raw = match.title?.trim();
  if (raw) return raw;
  const home = match.homeTeam?.name?.trim();
  const away = match.awayTeam?.name?.trim();
  if (home && away) return `${home} × ${away}`;
  return 'Partida';
}

type PartidaMatchHeroProps = {
  match: Match;
  displayNow?: number;
};

export function PartidaMatchHero({ match, displayNow }: PartidaMatchHeroProps) {
  const now = useDisplayNow([match], displayNow);
  const effectiveStatus = getEffectiveMatchStatus(match, now);
  const displayScores = resolveDisplayScores(match, now);
  const isLive = effectiveStatus === 'live';
  const status = statusChip(effectiveStatus);

  const metaParts = [
    `J${match.matchNumber}`,
    match.group ? `Grupo ${match.group}` : null,
    formatMatchDate(match.date),
    match.venue?.trim() ? match.venue.trim() : null,
  ].filter(Boolean);

  return (
    <div className={twMerge(isLive && liveFrame, isLive && 'rounded-2xl')}>
      {isLive ? (
        <span className={twMerge(liveFramePing, 'rounded-2xl')} aria-hidden />
      ) : null}
      <section
        className={twMerge(
          'relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-linear-to-br shadow-lg shadow-emerald-950/10 ring-1 ring-black/5',
          'from-emerald-950/6 via-white to-amber-50/35'
        )}
        aria-labelledby="partida-hero-heading"
      >
        <header className="border-b border-neutral-200/70 bg-white/45 px-5 py-4 backdrop-blur-[2px] sm:px-6">
          <h1
            id="partida-hero-heading"
            className="text-center text-lg font-bold leading-snug tracking-tight text-neutral-900 sm:text-left sm:text-xl"
          >
            {matchHeadingTitle(match)}
          </h1>
        </header>

        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          {isLive ? (
            <LiveBroadcastDot className="left-5 top-6 sm:left-8" />
          ) : null}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <span
              className={twMerge(
                'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                'border bg-white/80 text-neutral-700 shadow-sm'
              )}
            >
              {phaseLabel(match.phase)}
            </span>
            <span
              className={twMerge(
                'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                status.className
              )}
            >
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
            <div className="flex justify-end">
              {match.homeTeam ? (
                <TeamWithFlag
                  team={match.homeTeam}
                  className="max-w-full flex-col items-end gap-1.5 sm:gap-3 [&_[data-flag-frame]]:h-6! [&_[data-flag-frame]]:w-9! sm:[&_[data-flag-frame]]:h-8! sm:[&_[data-flag-frame]]:w-11!"
                  nameClassName="text-right text-xs font-semibold text-neutral-900 sm:text-lg"
                  href={
                    match.homeTeam.documentId
                      ? selecaoPath(match.homeTeam.documentId)
                      : undefined
                  }
                />
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </div>

            <div className="flex flex-col items-center justify-center gap-1 px-1 sm:gap-2 sm:px-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-400 sm:text-[10px] sm:tracking-[0.2em]">
                {isLive
                  ? 'Placar ao vivo'
                  : displayScores
                    ? 'Resultado'
                    : 'Placar'}
              </span>
              <div className="flex items-baseline gap-1 font-mono tabular-nums sm:gap-2">
                <span className="min-w-[2ch] text-center text-2xl font-bold text-neutral-900 sm:text-4xl">
                  {displayScores ? displayScores.home : '—'}
                </span>
                <span className="pb-0.5 text-sm font-light text-neutral-300 sm:pb-1 sm:text-lg">
                  ×
                </span>
                <span className="min-w-[2ch] text-center text-2xl font-bold text-neutral-900 sm:text-4xl">
                  {displayScores ? displayScores.away : '—'}
                </span>
              </div>
            </div>

            <div className="flex justify-start">
              {match.awayTeam ? (
                <TeamWithFlag
                  team={match.awayTeam}
                  className="max-w-full flex-col items-start gap-1.5 sm:gap-3 [&_[data-flag-frame]]:h-6! [&_[data-flag-frame]]:w-9! sm:[&_[data-flag-frame]]:h-8! sm:[&_[data-flag-frame]]:w-11!"
                  nameClassName="text-left text-xs font-semibold text-neutral-900 sm:text-lg"
                  href={
                    match.awayTeam.documentId
                      ? selecaoPath(match.awayTeam.documentId)
                      : undefined
                  }
                />
              ) : (
                <span className="text-neutral-500">—</span>
              )}
            </div>
          </div>
        </div>

        <footer className="border-t border-neutral-200/80 bg-black/2 px-5 py-3 text-center text-[11px] text-neutral-500 sm:text-xs">
          {metaParts.join(' · ')}
        </footer>
      </section>
    </div>
  );
}
