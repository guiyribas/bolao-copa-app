import type { CSSProperties } from 'react';
import type { Match } from '@/types';
import { isKnockoutPhase } from '@/lib/match-phases';
import type { BracketPhaseColumn, BracketSide } from './knockoutBracket.types';
import {
  BRACKET_CENTER_COLUMN_INDEX,
  BRACKET_PHASE_COLUMNS,
  BRACKET_RIGHT_WING_COLUMN_START,
  BRACKET_WING_MATCH_ROWS,
  SLOT_COUNT,
} from './knockoutBracket.constants';

const BRACKET_PHASE_SET = new Set<string>(BRACKET_PHASE_COLUMNS);

/** Ordem visual dos slots no chaveamento (árvore FIFA 2026, de cima para baixo). */
export const BRACKET_SLOT_ORDER: Record<BracketPhaseColumn, readonly number[]> = {
  round_of_32: [73, 75, 74, 77, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
  round_of_16: [90, 89, 93, 94, 91, 92, 95, 96],
  quarter: [97, 98, 99, 100],
  semi: [101, 102],
  third_place: [103],
  final: [104],
};

/** Agrupa partidas de mata-mata por fase e ordena por número do jogo. */
export function groupKnockoutByPhase(
  matches: Match[]
): Partial<Record<BracketPhaseColumn, Match[]>> {
  const map: Partial<Record<BracketPhaseColumn, Match[]>> = {};
  for (const m of matches) {
    if (!isKnockoutPhase(m.phase)) continue;
    if (!BRACKET_PHASE_SET.has(m.phase)) continue;
    const phase = m.phase as BracketPhaseColumn;
    if (!map[phase]) map[phase] = [];
    map[phase]!.push(m);
  }
  for (const col of BRACKET_PHASE_COLUMNS) {
    const list = map[col];
    if (list) list.sort((a, b) => a.matchNumber - b.matchNumber);
  }
  return map;
}

/** Preenche slots da fase na ordem do chaveamento; sobras ficam `null`. */
export function padPhaseSlots(
  matches: Match[] | undefined,
  phase: BracketPhaseColumn,
  slotCount: number
): (Match | null)[] {
  const slotOrder = BRACKET_SLOT_ORDER[phase];
  const byMatchNumber = new Map((matches ?? []).map((m) => [m.matchNumber, m]));
  const out: (Match | null)[] = Array.from({ length: slotCount }, () => null);

  for (let slotIdx = 0; slotIdx < Math.min(slotOrder.length, slotCount); slotIdx++) {
    const match = byMatchNumber.get(slotOrder[slotIdx]);
    if (match) out[slotIdx] = match;
  }

  return out;
}

export type BracketHalfSlotRange = {
  start: number;
  count: number;
};

/** Índices globais dos slots de uma metade do chaveamento. */
export function getBracketHalfSlotRange(
  phase: BracketPhaseColumn,
  side: BracketSide
): BracketHalfSlotRange {
  const total = SLOT_COUNT[phase];
  const count = total / 2;
  const start = side === 'left' ? 0 : count;
  return { start, count };
}

const MATCH_GRID_FIRST_ROW = 2;

function wingGridColumn(side: BracketSide, wingColumnIndex: number): number {
  if (side === 'left') return wingColumnIndex + 1;
  return BRACKET_RIGHT_WING_COLUMN_START + wingColumnIndex;
}

/** Posicionamento de células nas asas esquerda/direita. */
export function bracketWingCellPlacement({
  side,
  phase,
  localSlotIndex,
  wingColumnIndex,
}: {
  side: BracketSide;
  phase: BracketPhaseColumn;
  localSlotIndex: number;
  wingColumnIndex: number;
}): CSSProperties {
  const { count } = getBracketHalfSlotRange(phase, side);
  const span = BRACKET_WING_MATCH_ROWS / count;
  const start = MATCH_GRID_FIRST_ROW + localSlotIndex * span;
  return {
    gridColumn: wingGridColumn(side, wingColumnIndex),
    gridRow: `${start} / span ${span}`,
  };
}

/** Posicionamento da Final central, alinhada às semifinais. */
export function bracketCenterCellPlacement(): CSSProperties {
  return {
    gridColumn: BRACKET_CENTER_COLUMN_INDEX,
    gridRow: `${MATCH_GRID_FIRST_ROW} / span ${BRACKET_WING_MATCH_ROWS}`,
  };
}
