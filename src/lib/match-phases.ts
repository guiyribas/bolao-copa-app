export const GROUP_PHASE = 'group';

export const KNOCKOUT_PHASES = [
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
  'third_place',
  'final',
] as const;

export type KnockoutPhase = (typeof KNOCKOUT_PHASES)[number];

const KO_SET = new Set<string>(KNOCKOUT_PHASES);

export function isKnockoutPhase(phase: string): boolean {
  return KO_SET.has(phase);
}
