'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  jwt: string | null;
  hasHydrated: boolean;
  setAuth: (user: User, jwt: string) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      hasHydrated: false,
      setAuth: (user, jwt) => set({ user, jwt }),
      logout: () => set({ user: null, jwt: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'bolao-auth',
      partialize: (state) => ({ user: state.user, jwt: state.jwt }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
