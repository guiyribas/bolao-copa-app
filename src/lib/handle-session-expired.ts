'use client';

import { useAuthStore } from '@/stores/auth-store';

let handling = false;

export function handleSessionExpired(): void {
  if (handling) return;
  handling = true;

  useAuthStore.getState().logout();

  const returnUrl = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({ session: 'expired' });
  if (returnUrl && returnUrl !== '/login') {
    params.set('returnUrl', returnUrl);
  }
  window.location.assign(`/login?${params.toString()}`);
}
