'use client';

import Link from 'next/link';
import { TeamFlagImage } from '@/components/TeamWithFlag/teamFlagImage';
import type { Match } from '@/types';
import { partidaPath } from '@/lib/navigation';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { formatMatchDate } from '@/components/MatchCard/matchCard.utils';
import { resolveDisplayScores } from '@/lib/match-display';
import { useDisplayNow } from '@/hooks/useDisplayNow';
import { resolveKnockoutSlotLabel } from '@/lib/knockout-slot-label';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';
import {
  BRACKET_CARD_HEIGHT_REM,
  BRACKET_CENTER_COLUMN_INDEX,
  BRACKET_LEFT_WING_PHASES,
  BRACKET_RIGHT_WING_PHASES,
  BRACKET_ROW_HEIGHT_REM,
  BRACKET_TOTAL_COLUMNS,
  BRACKET_WING_MATCH_ROWS,
  bracketGridTemplateColumns,
  phaseColumnLabel,
  SLOT_COUNT,
} from './knockoutBracket.constants';
import type { BracketPhaseColumn, KnockoutBracketProps } from './knockoutBracket.types';
import * as styles from './knockoutBracket.styles';
import {
  bracketCenterCellPlacement,
  bracketWingCellPlacement,
  getBracketHalfSlotRange,
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

  const cardStyle = {
    height: `${BRACKET_CARD_HEIGHT_REM}rem`,
    minHeight: `${BRACKET_CARD_HEIGHT_REM}rem`,
  };

  const cardContent = (
    <>
      <div className={styles.cardDate}>{dateLabel}</div>
      <BracketTeamRow match={match} side="home" displayNow={displayNow} />
      <BracketTeamRow match={match} side="away" displayNow={displayNow} />
    </>
  );

  if (match) {
    return (
      <Link
        href={partidaPath(match.documentId)}
        className={styles.cardClickable}
        style={cardStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={styles.card} style={cardStyle}>
      {cardContent}
    </div>
  );
}

function renderWingSlots({
  side,
  phases,
  byPhase,
  resolvedNow,
}: {
  side: 'left' | 'right';
  phases: readonly BracketPhaseColumn[];
  byPhase: ReturnType<typeof groupKnockoutByPhase>;
  resolvedNow?: number;
}) {
  return phases.flatMap((phase, wingColIdx) => {
    const padded = padPhaseSlots(byPhase[phase], phase, SLOT_COUNT[phase]);
    const { start, count } = getBracketHalfSlotRange(phase, side);
    const isLastWingCol = wingColIdx === phases.length - 1;

    return padded.slice(start, start + count).map((match, localSlotIdx) => (
      <div
        key={`${side}-${phase}-${localSlotIdx}`}
        className={twMerge(
          styles.cardCell,
          !isLastWingCol ? styles.columnDivider : ''
        )}
        style={bracketWingCellPlacement({
          side,
          phase,
          localSlotIndex: localSlotIdx,
          wingColumnIndex: wingColIdx,
        })}
      >
        <BracketMatchCard match={match} displayNow={resolvedNow} />
      </div>
    ));
  });
}

export function KnockoutBracket({ matches, displayNow }: KnockoutBracketProps) {
  const resolvedNow = useDisplayNow(matches, displayNow);
  const byPhase = groupKnockoutByPhase(matches);

  const gridTemplateColumns = bracketGridTemplateColumns();
  const gridTemplateRows = `auto repeat(${BRACKET_WING_MATCH_ROWS}, ${BRACKET_ROW_HEIGHT_REM}rem)`;

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
        {BRACKET_LEFT_WING_PHASES.map((phase, colIdx) => (
          <div
            key={`h-left-${phase}`}
            className={twMerge(styles.phaseTitle, styles.columnDivider)}
            style={{ gridColumn: colIdx + 1, gridRow: 1 }}
          >
            {phaseColumnLabel(phase)}
          </div>
        ))}

        <div
          key="h-center"
          className={twMerge(
            styles.phaseTitle,
            styles.centerColumnTitle,
            styles.columnDivider
          )}
          style={{ gridColumn: BRACKET_CENTER_COLUMN_INDEX, gridRow: 1 }}
        >
          {phaseColumnLabel('final')}
        </div>

        {BRACKET_RIGHT_WING_PHASES.map((phase, colIdx) => {
          const gridColumn = BRACKET_CENTER_COLUMN_INDEX + 1 + colIdx;
          const isLastCol = gridColumn === BRACKET_TOTAL_COLUMNS;

          return (
            <div
              key={`h-right-${phase}`}
              className={twMerge(
                styles.phaseTitle,
                !isLastCol ? styles.columnDivider : ''
              )}
              style={{ gridColumn, gridRow: 1 }}
            >
              {phaseColumnLabel(phase)}
            </div>
          );
        })}

        {renderWingSlots({
          side: 'left',
          phases: BRACKET_LEFT_WING_PHASES,
          byPhase,
          resolvedNow,
        })}

        <div
          key="center-final"
          className={twMerge(styles.cardCell, styles.centerColumnCell)}
          style={bracketCenterCellPlacement()}
        >
          <BracketMatchCard
            match={
              padPhaseSlots(byPhase.final, 'final', SLOT_COUNT.final)[0]
            }
            displayNow={resolvedNow}
          />
        </div>

        {renderWingSlots({
          side: 'right',
          phases: BRACKET_RIGHT_WING_PHASES,
          byPhase,
          resolvedNow,
        })}
      </div>
    </div>
  );
}
