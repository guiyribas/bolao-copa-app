'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { matchesListPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import { pickLiveMatch } from '@/lib/pick-live-match';
import { useMatchDisplayNow } from '@/hooks/useMatchDisplayNow';
import type { Match } from '@/types';

export function useLiveMatch(
  jwt: string | null,
  hasHydrated: boolean,
  enabled = true,
) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const displayNow = useMatchDisplayNow(matches);

  const fetchMatches = useCallback(
    async (signal?: { cancelled: boolean }) => {
      if (!jwt) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const raw = await apiFetch<unknown>(
          matchesListPath(undefined),
          {},
          jwt,
        );
        if (signal?.cancelled) return;
        setMatches(normalizeMatchesPayload(raw));
      } catch {
        if (signal?.cancelled) return;
        setMatches([]);
      } finally {
        if (!signal?.cancelled) setLoading(false);
      }
    },
    [jwt],
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (!enabled) {
      void Promise.resolve().then(() => setLoading(false));
      return;
    }
    if (!jwt) {
      void Promise.resolve().then(() => {
        setMatches([]);
        setLoading(false);
      });
      return;
    }

    const signal = { cancelled: false };
    void fetchMatches(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [jwt, hasHydrated, enabled, fetchMatches]);

  const liveMatch = useMemo(
    () => pickLiveMatch(matches, displayNow),
    [matches, displayNow],
  );

  return { liveMatch, loading };
}
