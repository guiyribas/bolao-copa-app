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

/** Agrupa partidas de mata-mata por fase e ordena por número do jogo. */
export function groupKnockoutByPhase(matches: Match[]): Partial<Record<BracketPhaseColumn, Match[]>> {
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

/** Preenche slots da fase (posição fixa no chaveamento); sobras ficam `null`. */
export function padPhaseSlots(
  matches: Match[] | undefined,
  slotCount: number
): (Match | null)[] {
  const sorted = [...(matches ?? [])].sort((a, b) => a.matchNumber - b.matchNumber);
  const out: (Match | null)[] = Array.from({ length: slotCount }, () => null);
  for (let i = 0; i < Math.min(sorted.length, slotCount); i++) {
    out[i] = sorted[i];
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
