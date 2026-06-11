import type { Match } from '@/types';

export type MatchDisplayInput = Pick<
  Match,
  'date' | 'status' | 'homeScore' | 'awayScore'
>;

export type DisplayScores = {
  home: number;
  away: number;
  isPlaceholder: boolean;
};

const DISPLAY_CLOCK_WINDOW_MS = 24 * 60 * 60 * 1000;

export function hasKickoffPassed(
  match: Pick<Match, 'date'>,
  now = Date.now()
): boolean {
  return new Date(match.date).getTime() <= now;
}

export function getEffectiveMatchStatus(
  match: Pick<Match, 'date' | 'status'>,
  now = Date.now()
): Match['status'] {
  if (match.status === 'finished' || match.status === 'live') {
    return match.status;
  }
  if (match.status === 'scheduled' && hasKickoffPassed(match, now)) {
    return 'live';
  }
  return 'scheduled';
}

export function resolveDisplayScores(
  match: MatchDisplayInput,
  now = Date.now()
): DisplayScores | null {
  const hs = match.homeScore;
  const as = match.awayScore;

  if (hs != null && as != null) {
    return { home: hs, away: as, isPlaceholder: false };
  }

  if (match.status === 'finished') {
    return null;
  }

  if (hs == null && as == null && hasKickoffPassed(match, now)) {
    return { home: 0, away: 0, isPlaceholder: true };
  }

  return null;
}

/** Scheduled match whose UI may change from the local clock before the API updates. */
export function matchNeedsDisplayClock(
  match: MatchDisplayInput,
  now = Date.now()
): boolean {
  if (match.status !== 'scheduled') {
    return false;
  }

  const kickoff = new Date(match.date).getTime();
  if (Number.isNaN(kickoff)) {
    return false;
  }

  const delta = kickoff - now;
  return delta <= DISPLAY_CLOCK_WINDOW_MS && delta >= -DISPLAY_CLOCK_WINDOW_MS;
}

export function anyMatchNeedsDisplayClock(
  matches: MatchDisplayInput[],
  now = Date.now()
): boolean {
  return matches.some((match) => matchNeedsDisplayClock(match, now));
}

export function nextKickoffMs(
  matches: MatchDisplayInput[],
  now = Date.now()
): number | null {
  let next: number | null = null;

  for (const match of matches) {
    if (!matchNeedsDisplayClock(match, now)) continue;
    const kickoff = new Date(match.date).getTime();
    if (Number.isNaN(kickoff) || kickoff <= now) continue;
    if (next == null || kickoff < next) {
      next = kickoff;
    }
  }

  return next;
}
