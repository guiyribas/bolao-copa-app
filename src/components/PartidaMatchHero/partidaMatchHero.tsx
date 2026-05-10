'use client';

import { twMerge } from 'tailwind-merge';
import type { Match } from '@/types';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { LiveBroadcastDot } from '@/components/LiveBroadcastDot/liveBroadcastDot';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';

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

function statusChip(match: Match): { label: string; className: string } {
  switch (match.status) {
    case 'live':
      return {
        label: 'Ao vivo',
        className:
          'border-green-600/40 bg-green-50 text-green-900 ring-1 ring-green-600/20',
      };
    case 'finished':
      return {
        label: 'Finalizada',
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
};

export function PartidaMatchHero({ match }: PartidaMatchHeroProps) {
  const isLive = match.status === 'live';
  const hs = match.homeScore;
  const as = match.awayScore;
  const hasOfficial = hs != null && as != null;

  const status = statusChip(match);

  const metaParts = [
    `J${match.matchNumber}`,
    match.group ? `Grupo ${match.group}` : null,
    formatMatchDate(match.date),
    match.venue?.trim() ? match.venue.trim() : null,
  ].filter(Boolean);

  return (
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
        {isLive ? <LiveBroadcastDot className="left-5 top-6 sm:left-8" /> : null}
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

        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex justify-center sm:justify-end">
            {match.homeTeam ? (
              <TeamWithFlag
                team={match.homeTeam}
                className="max-w-full flex-col items-center gap-3 sm:items-end [&_img]:h-8! [&_img]:w-11!"
                nameClassName="text-center text-base font-semibold text-neutral-900 sm:text-right sm:text-lg"
              />
            ) : (
              <span className="text-neutral-500">—</span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 px-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {isLive ? 'Placar ao vivo' : hasOfficial ? 'Resultado' : 'Placar'}
            </span>
            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="min-w-[2ch] text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
                {hasOfficial ? hs : '—'}
              </span>
              <span className="pb-1 text-lg font-light text-neutral-300">×</span>
              <span className="min-w-[2ch] text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
                {hasOfficial ? as : '—'}
              </span>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start">
            {match.awayTeam ? (
              <TeamWithFlag
                team={match.awayTeam}
                className="max-w-full flex-col items-center gap-3 sm:items-start [&_img]:h-8! [&_img]:w-11!"
                nameClassName="text-center text-base font-semibold text-neutral-900 sm:text-left sm:text-lg"
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
  );
}
