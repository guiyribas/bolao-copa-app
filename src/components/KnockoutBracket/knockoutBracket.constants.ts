import type { BracketPhaseColumn } from './knockoutBracket.types';

export const BRACKET_GRID_MATCH_ROWS = 16;

/** Altura de cada linha da grade (uma linha = um slot na Segunda fase). */
export const BRACKET_ROW_HEIGHT_REM = 3.75;

/** Altura fixa do card de partida (mesmo tamanho em todas as fases). */
export const BRACKET_CARD_HEIGHT_REM = 3.35;

/** Ordem das colunas da esquerda para a direita. */
export const BRACKET_PHASE_COLUMNS: readonly BracketPhaseColumn[] = [
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
  'third_place',
  'final',
] as const;

/** Quantidade de jogos por fase no formato Copa (32 equipes). */
export const SLOT_COUNT: Record<BracketPhaseColumn, number> = {
  round_of_32: 16,
  round_of_16: 8,
  quarter: 4,
  semi: 2,
  third_place: 1,
  final: 1,
};

const PHASE_LABELS: Record<BracketPhaseColumn, string> = {
  round_of_32: 'Segunda fase',
  round_of_16: 'Oitavas',
  quarter: 'Quartas',
  semi: 'Semifinais',
  third_place: '3º lugar',
  final: 'Final',
};

export function phaseColumnLabel(phase: BracketPhaseColumn): string {
  return PHASE_LABELS[phase];
}
