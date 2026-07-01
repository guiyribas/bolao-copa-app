'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { PoolMembership } from '@/types';

export function usePoolMemberships(
  jwt: string | null,
  hasHydrated: boolean,
  enabled = true,
) {
  const [memberships, setMemberships] = useState<PoolMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberships = useCallback(
    async (signal?: { cancelled: boolean }) => {
      if (!jwt) {
        setMemberships([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch<{ data: PoolMembership[] }>(
          '/api/pools/mine/memberships',
          {},
          jwt,
        );
        if (signal?.cancelled) return;
        setMemberships(res.data || []);
      } catch (err) {
        if (signal?.cancelled) return;
        setMemberships([]);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch memberships'),
        );
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
        setMemberships([]);
        setLoading(false);
      });
      return;
    }

    const signal = { cancelled: false };
    void fetchMemberships(signal);

    return () => {
      signal.cancelled = true;
    };
  }, [jwt, hasHydrated, enabled, fetchMemberships]);

  const refresh = useCallback(() => fetchMemberships(), [fetchMemberships]);

  return { memberships, loading, error, refresh };
}
