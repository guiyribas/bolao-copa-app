'use client';

import Link from 'next/link';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Match } from '@/types';
import { selecaoPath } from '@/lib/navigation';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import {
  getEffectiveMatchStatus,
  resolveDisplayScores,
} from '@/lib/match-display';
import { useDisplayNow } from '@/hooks/useDisplayNow';
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
      return 'Encerrada';
    default:
      return 'Agendada';
  }
}

export function FixtureMatchRow({
  match,
  showPalpitesLink = true,
  displayNow,
}: {
  match: Match;
  showPalpitesLink?: boolean;
  displayNow?: number;
}) {
  const now = useDisplayNow([match], displayNow);
  const effectiveStatus = getEffectiveMatchStatus(match, now);
  const displayScores = resolveDisplayScores(match, now);
  const isLive = effectiveStatus === 'live';

  return (
    <div className={twMerge(styles.row, isLive && styles.rowLive)}>
      {isLive ? <LiveBroadcastDot /> : null}
      <div className={styles.sideHome}>
        {match.homeTeam ? (
          <TeamWithFlag
            team={match.homeTeam}
            nameClassName="text-right"
            href={
              match.homeTeam.documentId
                ? selecaoPath(match.homeTeam.documentId)
                : undefined
            }
          />
        ) : (
          <span>-</span>
        )}
      </div>

      <div className={styles.scores}>
        {displayScores ? (
          <>
            <span>{displayScores.home}</span>
            <span className="text-neutral-400">×</span>
            <span>{displayScores.away}</span>
          </>
        ) : (
          <span className="text-neutral-400 font-normal text-sm select-none">
            - × -
          </span>
        )}
      </div>

      <div className={styles.side}>
        {match.awayTeam ? (
          <TeamWithFlag
            team={match.awayTeam}
            href={
              match.awayTeam.documentId
                ? selecaoPath(match.awayTeam.documentId)
                : undefined
            }
          />
        ) : (
          <span>-</span>
        )}
      </div>

      <div className={styles.meta}>
        <span className={statusBadgeClass(effectiveStatus)}>
          {statusLabel(effectiveStatus)}
        </span>
        <div className={styles.metaDetailRow}>
          <span className="min-w-0 shrink text-neutral-500">
            J{match.matchNumber}
            {match.group ? ` · Grupo ${match.group}` : ''}
            {' · '}
            {formatMatchDate(match.date)}
          </span>
          {showPalpitesLink ? (
            <Link
              href={`/partida/${encodeURIComponent(match.documentId)}`}
              className={twMerge(styles.matchDetailTextLinkClass, 'shrink-0')}
              aria-label="Ver palpites para a partida"
            >
              Ver palpites para a partida
              <ChevronRightIcon className="size-3.5 opacity-80" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
