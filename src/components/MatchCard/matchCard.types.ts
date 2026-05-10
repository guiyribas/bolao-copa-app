import type { Match, Bet } from '@/types';

export interface MatchCardProps {
  match: Match;
  bet?: Bet;
  /** Sem edição (ex.: palpites de outro participante). */
  readOnly?: boolean;
  onSave?: (homeScore: number, awayScore: number) => Promise<void>;
}
