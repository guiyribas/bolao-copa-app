import type { CSSProperties } from 'react';
import type { Match } from '@/types';
import { isKnockoutPhase } from '@/lib/match-phases';
import type { BracketPhaseColumn } from './knockoutBracket.types';
import {
  BRACKET_GRID_MATCH_ROWS,
  BRACKET_PHASE_COLUMNS,
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

const MATCH_GRID_FIRST_ROW = 2;

export function bracketCellPlacement(
  phase: BracketPhaseColumn,
  slotIndex: number,
  columnIndex: number
): CSSProperties {
  const slots = SLOT_COUNT[phase];
  const span = BRACKET_GRID_MATCH_ROWS / slots;
  const start = MATCH_GRID_FIRST_ROW + slotIndex * span;
  return {
    gridColumn: columnIndex + 1,
    gridRow: `${start} / span ${span}`,
  };
}
