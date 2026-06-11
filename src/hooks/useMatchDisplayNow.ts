import { useEffect, useState } from 'react';

import {
  anyMatchNeedsDisplayClock,
  nextKickoffMs,
  type MatchDisplayInput,
} from '@/lib/match-display';

const FALLBACK_TICK_MS = 60_000;

export function useMatchDisplayNow(matches: MatchDisplayInput[]): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let kickoffTimeout: ReturnType<typeof setTimeout> | undefined;
    let fallbackInterval: ReturnType<typeof setInterval> | undefined;

    const clearTimers = () => {
      if (kickoffTimeout) clearTimeout(kickoffTimeout);
      if (fallbackInterval) clearInterval(fallbackInterval);
      kickoffTimeout = undefined;
      fallbackInterval = undefined;
    };

    const syncNow = () => {
      setNow(Date.now());
    };

    const schedule = () => {
      clearTimers();

      const currentNow = Date.now();
      if (!anyMatchNeedsDisplayClock(matches, currentNow)) {
        return;
      }

      const upcomingKickoff = nextKickoffMs(matches, currentNow);
      if (upcomingKickoff != null) {
        kickoffTimeout = setTimeout(syncNow, upcomingKickoff - currentNow + 50);
      }

      fallbackInterval = setInterval(syncNow, FALLBACK_TICK_MS);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearTimers();
        return;
      }
      syncNow();
      schedule();
    };

    schedule();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearTimers();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [matches]);

  return now;
}
