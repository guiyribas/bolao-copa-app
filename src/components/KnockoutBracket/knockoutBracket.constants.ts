import type { BracketPhaseColumn } from './knockoutBracket.types';

export const BRACKET_GRID_MATCH_ROWS = 16;

/** Linhas da grade por metade do chaveamento (cada asa). */
export const BRACKET_WING_MATCH_ROWS = BRACKET_GRID_MATCH_ROWS / 2;

/** Altura de cada linha da grade (uma linha = um slot na Segunda fase). */
export const BRACKET_ROW_HEIGHT_REM = 3.75;

/** Altura fixa do card de partida (mesmo tamanho em todas as fases). */
export const BRACKET_CARD_HEIGHT_REM = 3.35;

/** Ordem linear legada (todas as fases). */
export const BRACKET_PHASE_COLUMNS: readonly BracketPhaseColumn[] = [
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
  'third_place',
  'final',
] as const;

/** Asa esquerda: da Segunda fase até a semifinal. */
export const BRACKET_LEFT_WING_PHASES: readonly BracketPhaseColumn[] = [
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
] as const;

/** Asa direita: da semifinal até a Segunda fase (espelhada). */
export const BRACKET_RIGHT_WING_PHASES: readonly BracketPhaseColumn[] = [
  'semi',
  'quarter',
  'round_of_16',
  'round_of_32',
] as const;

export const BRACKET_LEFT_WING_COLUMN_COUNT = BRACKET_LEFT_WING_PHASES.length;

export const BRACKET_CENTER_COLUMN_COUNT = 1;

export const BRACKET_RIGHT_WING_COLUMN_COUNT = BRACKET_RIGHT_WING_PHASES.length;

export const BRACKET_TOTAL_COLUMNS =
  BRACKET_LEFT_WING_COLUMN_COUNT +
  BRACKET_CENTER_COLUMN_COUNT +
  BRACKET_RIGHT_WING_COLUMN_COUNT;

/** Coluna 1-based da coluna central (Final). */
export const BRACKET_CENTER_COLUMN_INDEX =
  BRACKET_LEFT_WING_COLUMN_COUNT + 1;

/** Coluna 1-based onde começa a asa direita. */
export const BRACKET_RIGHT_WING_COLUMN_START =
  BRACKET_CENTER_COLUMN_INDEX + BRACKET_CENTER_COLUMN_COUNT;

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

export function bracketGridTemplateColumns(): string {
  const wingCol = 'minmax(132px, 1fr)';
  const centerCol = 'minmax(140px, 1.2fr)';
  return [
    ...Array.from({ length: BRACKET_LEFT_WING_COLUMN_COUNT }, () => wingCol),
    centerCol,
    ...Array.from({ length: BRACKET_RIGHT_WING_COLUMN_COUNT }, () => wingCol),
  ].join(' ');
}
