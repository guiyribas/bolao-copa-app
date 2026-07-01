'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePoolMemberships } from '@/hooks/usePoolMemberships';
import { useAuthStore } from '@/stores/auth-store';
import type { PoolMembership } from '@/types';

type UserMembershipsValue = {
  memberships: PoolMembership[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

const UserMembershipsContext = createContext<UserMembershipsValue | null>(null);

export function UserMembershipsProvider({ children }: { children: ReactNode }) {
  const { jwt, hasHydrated } = useAuthStore();
  const value = usePoolMemberships(jwt, hasHydrated);

  return (
    <UserMembershipsContext.Provider value={value}>
      {children}
    </UserMembershipsContext.Provider>
  );
}

export function useUserMemberships(): UserMembershipsValue {
  const ctx = useContext(UserMembershipsContext);
  if (!ctx) {
    throw new Error(
      'useUserMemberships must be used within UserMembershipsProvider',
    );
  }
  return ctx;
}
