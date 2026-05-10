'use client';

import Image from 'next/image';
import type { Match } from '@/types';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';
import {
  BRACKET_CARD_HEIGHT_REM,
  BRACKET_GRID_MATCH_ROWS,
  BRACKET_PHASE_COLUMNS,
  BRACKET_ROW_HEIGHT_REM,
  phaseColumnLabel,
  SLOT_COUNT,
} from './knockoutBracket.constants';
import type { KnockoutBracketProps } from './knockoutBracket.types';
import * as styles from './knockoutBracket.styles';
import {
  bracketCellPlacement,
  groupKnockoutByPhase,
  padPhaseSlots,
} from './knockoutBracket.utils';
import { twMerge } from 'tailwind-merge';

function ShieldPlaceholder() {
  return (
    <span className={styles.placeholderIcon} aria-hidden>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-neutral-500">
        <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm0 2.18 6 2.25v4.82c0 4.52-3.1 8.78-6 9.81-2.9-1.03-6-5.29-6-9.81V6.43l6-2.25Z" />
      </svg>
    </span>
  );
}

function BracketTeamRow({
  match,
  side,
}: {
  match: Match | null;
  side: 'home' | 'away';
}) {
  const team = match ? (side === 'home' ? match.homeTeam : match.awayTeam) : null;
  const score =
    match && match.homeScore != null && match.awayScore != null
      ? side === 'home'
        ? match.homeScore
        : match.awayScore
      : null;

  if (!match) {
    return (
      <div className={styles.teamRow}>
        <ShieldPlaceholder />
        <span className={styles.placeholderLabel}>A definir</span>
      </div>
    );
  }

  if (team && team.documentId) {
    return (
      <div className={styles.teamRow}>
        <TeamWithFlag
          team={team}
          className="min-w-0 flex-1"
          nameClassName={twMerge(styles.teamName, 'text-[11px]')}
        />
        {score != null ? <span className={styles.scoreInline}>{score}</span> : null}
      </div>
    );
  }

  const flagSrc = team ? resolveTeamFlagUrl(team) : null;
  return (
    <div className={styles.teamRow}>
      {flagSrc ? (
        <Image
          src={flagSrc}
          alt=""
          width={18}
          height={13}
          className="shrink-0 rounded-[2px] border border-neutral-600 object-cover"
          unoptimized
        />
      ) : (
        <ShieldPlaceholder />
      )}
      <span className={styles.placeholderLabel}>A definir</span>
      {score != null ? <span className={styles.scoreInline}>{score}</span> : null}
    </div>
  );
}

function BracketMatchCard({ match }: { match: Match | null }) {
  const dateLabel =
    match && match.date ? formatMatchDate(match.date) : 'Data a definir';

  return (
    <div
      className={styles.card}
      style={{ height: `${BRACKET_CARD_HEIGHT_REM}rem`, minHeight: `${BRACKET_CARD_HEIGHT_REM}rem` }}
    >
      <div className={styles.cardDate}>{dateLabel}</div>
      <BracketTeamRow match={match} side="home" />
      <BracketTeamRow match={match} side="away" />
    </div>
  );
}

export function KnockoutBracket({ matches }: KnockoutBracketProps) {
  const byPhase = groupKnockoutByPhase(matches);

  const gridTemplateColumns = `repeat(${BRACKET_PHASE_COLUMNS.length}, minmax(132px, 1fr))`;
  const gridTemplateRows = `auto repeat(${BRACKET_GRID_MATCH_ROWS}, ${BRACKET_ROW_HEIGHT_REM}rem)`;

  return (
    <div className={styles.scrollWrap} role="region" aria-label="Chaveamento do mata-mata">
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns,
          gridTemplateRows,
        }}
      >
        {BRACKET_PHASE_COLUMNS.map((phase, colIdx) => (
          <div
            key={`h-${phase}`}
            className={twMerge(
              styles.phaseTitle,
              colIdx < BRACKET_PHASE_COLUMNS.length - 1 ? styles.columnDivider : ''
            )}
            style={{ gridColumn: colIdx + 1, gridRow: 1 }}
          >
            {phaseColumnLabel(phase)}
          </div>
        ))}

        {BRACKET_PHASE_COLUMNS.map((phase, colIdx) => {
          const padded = padPhaseSlots(byPhase[phase], SLOT_COUNT[phase]);
          const isLastCol = colIdx === BRACKET_PHASE_COLUMNS.length - 1;

          return padded.map((match, slotIdx) => (
            <div
              key={`${phase}-${slotIdx}`}
              className={twMerge(
                styles.cardCell,
                !isLastCol ? styles.columnDivider : ''
              )}
              style={bracketCellPlacement(phase, slotIdx, colIdx)}
            >
              <BracketMatchCard match={match} />
            </div>
          ));
        })}
      </div>
    </div>
  );
}
