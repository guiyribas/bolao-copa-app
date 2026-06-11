import type { MatchDisplayInput } from '@/lib/match-display';

import { useMatchDisplayNow } from './useMatchDisplayNow';

/** Parent `displayNow` or the hook's local clock (avoids `Date.now()` during render). */
export function useDisplayNow(
  matches: MatchDisplayInput[],
  displayNow?: number
): number {
  const tickNow = useMatchDisplayNow(matches);
  return displayNow ?? tickNow;
}
