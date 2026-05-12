'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { Pool } from '@/types';
import { apiFetch } from '@/lib/api';
import { normalizePoolFromApi } from '@/lib/pool-normalize';

type PoolLayoutValue = {
  pool: Pool;
  setPool: Dispatch<SetStateAction<Pool | null>>;
  refreshPool: () => Promise<void>;
  /** Criador do bolão — pode editar definições e pagamentos. */
  isAdmin: boolean;
};

const PoolLayoutContext = createContext<PoolLayoutValue | null>(null);

export function PoolLayoutProvider({
  poolId,
  jwt,
  pool,
  setPool,
  isAdmin,
  children,
}: {
  poolId: string;
  jwt: string;
  pool: Pool;
  setPool: Dispatch<SetStateAction<Pool | null>>;
  isAdmin: boolean;
  children: ReactNode;
}) {
  const refreshPool = useCallback(async () => {
    const res = await apiFetch<unknown>(
      `/api/pools/${poolId}/session`,
      {},
      jwt
    );
    const next = normalizePoolFromApi(res);
    if (next) {
      setPool((prev) => ({
        ...next,
        viewerJoinedAt: next.viewerJoinedAt ?? prev?.viewerJoinedAt,
      }));
    }
  }, [jwt, poolId, setPool]);

  const value = useMemo(
    () => ({ pool, setPool, refreshPool, isAdmin }),
    [pool, isAdmin, refreshPool, setPool]
  );

  return (
    <PoolLayoutContext.Provider value={value}>
      {children}
    </PoolLayoutContext.Provider>
  );
}

export function usePoolLayout(): PoolLayoutValue {
  const ctx = useContext(PoolLayoutContext);
  if (!ctx) {
    throw new Error('usePoolLayout must be used within PoolLayoutProvider');
  }
  return ctx;
}
