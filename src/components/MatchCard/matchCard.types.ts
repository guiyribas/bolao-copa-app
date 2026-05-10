import type { Match, Bet } from '@/types';

export interface MatchCardProps {
  match: Match;
  bet?: Bet;
  onSave: (homeScore: number, awayScore: number) => Promise<void>;
}
