'use client';

import type { Match } from '@/types';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import * as styles from './fixtureMatchRow.styles';
import { twMerge } from 'tailwind-merge';
import { LiveBroadcastDot } from '@/components/LiveBroadcastDot/liveBroadcastDot';

function statusBadgeClass(status: Match['status']): string {
  switch (status) {
    case 'live':
      return twMerge(styles.badge, 'border-green-700 text-green-800 bg-green-50');
    case 'finished':
      return twMerge(styles.badge, 'border-neutral-300 text-neutral-600 bg-neutral-50');
    default:
      return twMerge(styles.badge, 'border-amber-200 text-amber-800 bg-amber-50');
  }
}

function statusLabel(status: Match['status']): string {
  switch (status) {
    case 'live':
      return 'Ao vivo';
    case 'finished':
      return 'Final';
    default:
      return 'Agendada';
  }
}

export function FixtureMatchRow({ match }: { match: Match }) {
  const hs = match.homeScore;
  const as = match.awayScore;
  const hasScores = hs != null && as != null;
  const isLive = match.status === 'live';

  return (
    <div className={twMerge(styles.row, isLive && styles.rowLive)}>
      {isLive ? <LiveBroadcastDot /> : null}
      <div className={styles.sideHome}>
        {match.homeTeam ? (
          <TeamWithFlag team={match.homeTeam} nameClassName="text-right" />
        ) : (
          <span>-</span>
        )}
      </div>

      <div className={styles.scores}>
        {hasScores ? (
          <>
            <span>{hs}</span>
            <span className="text-neutral-400">×</span>
            <span>{as}</span>
          </>
        ) : (
          <span className="text-neutral-400 font-normal text-sm select-none">
            - × -
          </span>
        )}
      </div>

      <div className={styles.side}>
        {match.awayTeam ? <TeamWithFlag team={match.awayTeam} /> : <span>-</span>}
      </div>

      <div className={styles.meta}>
        <span className={statusBadgeClass(match.status)}>{statusLabel(match.status)}</span>
        <span>
          J{match.matchNumber}
          {match.group ? ` · Grupo ${match.group}` : ''}
          {' · '}
          {formatMatchDate(match.date)}
        </span>
      </div>
    </div>
  );
}
