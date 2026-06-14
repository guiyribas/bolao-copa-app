/**
 * Pontuação de palpites — manter em sync com
 * `bolao-copa-api/src/api/bet/services/scoring.ts`.
 */
import {
  getEffectiveMatchStatus,
  resolveDisplayScores,
} from '@/lib/match-display';
import { isKnockoutPhase } from '@/lib/match-phases';
import type { Match, PoolMatchBetRow } from '@/types';

const POINTS_GROUP = {
  EXACT_SCORE: 10,
  WINNER_AND_WINNER_GOALS: 8,
  WINNER_AND_GOAL_DIFFERENCE: 7,
  CORRECT_DRAW: 6,
  WINNER_AND_LOSER_GOALS: 5,
  WINNER_ONLY: 3,
  MISS: 0,
};

const POINTS_KNOCKOUT = {
  EXACT_SCORE: 15,
  WINNER_AND_WINNER_GOALS: 12,
  WINNER_AND_GOAL_DIFFERENCE: 10,
  CORRECT_DRAW: 9,
  WINNER_AND_LOSER_GOALS: 7,
  WINNER_ONLY: 5,
  MISS: 0,
};

interface MatchResult {
  homeScore: number;
  awayScore: number;
  phase: string;
}

interface BetPrediction {
  homeScore: number;
  awayScore: number;
}

function getWinner(home: number, away: number): 'home' | 'away' | 'draw' {
  if (home > away) return 'home';
  if (away > home) return 'away';
  return 'draw';
}

export function calculatePoints(bet: BetPrediction, match: MatchResult): number {
  const points = isKnockoutPhase(match.phase) ? POINTS_KNOCKOUT : POINTS_GROUP;

  const betWinner = getWinner(bet.homeScore, bet.awayScore);
  const matchWinner = getWinner(match.homeScore, match.awayScore);

  if (bet.homeScore === match.homeScore && bet.awayScore === match.awayScore) {
    return points.EXACT_SCORE;
  }

  if (matchWinner === 'draw' && betWinner === 'draw') {
    return points.CORRECT_DRAW;
  }

  if (betWinner !== matchWinner) {
    return points.MISS;
  }

  const betGoalDiff = bet.homeScore - bet.awayScore;
  const matchGoalDiff = match.homeScore - match.awayScore;

  const betWinnerGoals = betWinner === 'home' ? bet.homeScore : bet.awayScore;
  const matchWinnerGoals =
    matchWinner === 'home' ? match.homeScore : match.awayScore;
  const betLoserGoals = betWinner === 'home' ? bet.awayScore : bet.homeScore;
  const matchLoserGoals =
    matchWinner === 'home' ? match.awayScore : match.homeScore;

  if (betWinnerGoals === matchWinnerGoals) {
    return points.WINNER_AND_WINNER_GOALS;
  }

  if (betGoalDiff === matchGoalDiff) {
    return points.WINNER_AND_GOAL_DIFFERENCE;
  }

  if (betLoserGoals === matchLoserGoals) {
    return points.WINNER_AND_LOSER_GOALS;
  }

  return points.WINNER_ONLY;
}

export function resolvePoolBetDisplayPoints(
  entry: Pick<PoolMatchBetRow, 'homeScore' | 'awayScore' | 'points'>,
  match: Pick<Match, 'date' | 'status' | 'homeScore' | 'awayScore' | 'phase'>,
  now: number
): { points: number; isPartial: boolean } | null {
  if (entry.points != null) {
    return { points: entry.points, isPartial: false };
  }

  if (entry.homeScore == null || entry.awayScore == null) {
    return null;
  }

  const status = getEffectiveMatchStatus(match, now);
  if (status !== 'live' && status !== 'finished') {
    return null;
  }

  const scores = resolveDisplayScores(match, now);
  if (!scores) {
    return null;
  }

  return {
    points: calculatePoints(
      { homeScore: entry.homeScore, awayScore: entry.awayScore },
      {
        homeScore: scores.home,
        awayScore: scores.away,
        phase: match.phase,
      }
    ),
    isPartial: true,
  };
}
