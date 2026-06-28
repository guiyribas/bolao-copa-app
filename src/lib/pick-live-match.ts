import type { Match } from '@/types';

import { getEffectiveMatchStatus } from './match-display';

export function pickLiveMatch(matches: Match[], now = Date.now()): Match | null {
  return (
    matches
      .filter((match) => getEffectiveMatchStatus(match, now) === 'live')
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0] ?? null
  );
}
