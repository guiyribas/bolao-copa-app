'use client';

import { TeamFlagImage } from '@/components/TeamWithFlag/teamFlagImage';
import type { Match } from '@/types';
import { selecaoPath } from '@/lib/navigation';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import { resolveDisplayScores } from '@/lib/match-display';
import { useDisplayNow } from '@/hooks/useDisplayNow';
import { resolveKnockoutSlotLabel } from '@/lib/knockout-slot-label';
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
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-neutral-500"
      >
        <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Zm0 2.18 6 2.25v4.82c0 4.52-3.1 8.78-6 9.81-2.9-1.03-6-5.29-6-9.81V6.43l6-2.25Z" />
      </svg>
    </span>
  );
}

function BracketTeamRow({
  match,
  side,
  displayNow,
}: {
  match: Match | null;
  side: 'home' | 'away';
  displayNow?: number;
}) {
  const team = match
    ? side === 'home'
      ? match.homeTeam
      : match.awayTeam
    : null;
  const displayScores =
    match && displayNow != null
      ? resolveDisplayScores(match, displayNow)
      : null;
  const score = displayScores
    ? side === 'home'
      ? displayScores.home
      : displayScores.away
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
          href={selecaoPath(team.documentId)}
        />
        {score != null ? (
          <span className={styles.scoreInline}>{score}</span>
        ) : null}
      </div>
    );
  }

  const slotLabel = resolveKnockoutSlotLabel(match, side);
  const flagSrc = team ? resolveTeamFlagUrl(team) : null;
  return (
    <div className={styles.teamRow}>
      {flagSrc ? (
        <TeamFlagImage src={flagSrc} size="bracket" />
      ) : (
        <ShieldPlaceholder />
      )}
      <span
        className={twMerge(styles.placeholderLabel, 'min-w-0 truncate')}
        title={slotLabel}
      >
        {slotLabel}
      </span>
      {score != null ? (
        <span className={styles.scoreInline}>{score}</span>
      ) : null}
    </div>
  );
}

function BracketMatchCard({
  match,
  displayNow,
}: {
  match: Match | null;
  displayNow?: number;
}) {
  const dateLabel =
    match && match.date ? formatMatchDate(match.date) : 'Data a definir';

  return (
    <div
      className={styles.card}
      style={{
        height: `${BRACKET_CARD_HEIGHT_REM}rem`,
        minHeight: `${BRACKET_CARD_HEIGHT_REM}rem`,
      }}
    >
      <div className={styles.cardDate}>{dateLabel}</div>
      <BracketTeamRow match={match} side="home" displayNow={displayNow} />
      <BracketTeamRow match={match} side="away" displayNow={displayNow} />
    </div>
  );
}

export function KnockoutBracket({ matches, displayNow }: KnockoutBracketProps) {
  const resolvedNow = useDisplayNow(matches, displayNow);
  const byPhase = groupKnockoutByPhase(matches);

  const gridTemplateColumns = `repeat(${BRACKET_PHASE_COLUMNS.length}, minmax(132px, 1fr))`;
  const gridTemplateRows = `auto repeat(${BRACKET_GRID_MATCH_ROWS}, ${BRACKET_ROW_HEIGHT_REM}rem)`;

  return (
    <div
      className={styles.scrollWrap}
      role="region"
      aria-label="Chaveamento do mata-mata"
    >
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
              colIdx < BRACKET_PHASE_COLUMNS.length - 1
                ? styles.columnDivider
                : ''
            )}
            style={{ gridColumn: colIdx + 1, gridRow: 1 }}
          >
            {phaseColumnLabel(phase)}
          </div>
        ))}

        {BRACKET_PHASE_COLUMNS.map((phase, colIdx) => {
          const padded = padPhaseSlots(
            byPhase[phase],
            phase,
            SLOT_COUNT[phase]
          );
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
              <BracketMatchCard match={match} displayNow={resolvedNow} />
            </div>
          ));
        })}
      </div>
    </div>
  );
}
