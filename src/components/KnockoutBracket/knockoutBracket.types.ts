import type { Match } from '@/types';

export type BracketPhaseColumn =
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter'
  | 'semi'
  | 'third_place'
  | 'final';

export type BracketSide = 'left' | 'right';

export type KnockoutBracketProps = {
  matches: Match[];
  displayNow?: number;
};
