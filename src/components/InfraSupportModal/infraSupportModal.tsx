'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import { saveBtn } from '@/components/MatchCard/matchCard.styles';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import {
  dismissInfraSupportModal,
  INFRA_SUPPORT_DONATION_HREF,
  INFRA_SUPPORT_MODAL_DESCRIPTION,
  INFRA_SUPPORT_MODAL_DISMISS_LABEL,
  INFRA_SUPPORT_MODAL_DONATE_LABEL,
  INFRA_SUPPORT_MODAL_OPEN_DELAY_MS,
  INFRA_SUPPORT_MODAL_TITLE,
  isInfraSupportModalDismissed,
  isInfraSupportModalSuppressedPath,
  userBelongsToExcludedPool,
} from '@/lib/infra-support-modal';
import type { PoolMembership } from '@/types';

export function InfraSupportModal() {
  const pathname = usePathname();
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();
  const [eligible, setEligible] = useState(false);

  const canConsiderShowing =
    hasHydrated &&
    !!jwt &&
    !isInfraSupportModalSuppressedPath(pathname) &&
    !isInfraSupportModalDismissed();

  const open = canConsiderShowing && eligible;

  useEffect(() => {
    if (!canConsiderShowing || !jwt) return;

    let cancelled = false;
    let openTimer: ReturnType<typeof setTimeout> | undefined;

    apiFetch<{ data: PoolMembership[] }>('/api/pools/mine/memberships', {}, jwt)
      .then((res) => {
        if (cancelled) return;
        const memberships = res.data ?? [];
        if (userBelongsToExcludedPool(memberships)) {
          setEligible(false);
          return;
        }
        openTimer = setTimeout(() => {
          if (!cancelled) setEligible(true);
        }, INFRA_SUPPORT_MODAL_OPEN_DELAY_MS);
      })
      .catch(() => {
        if (!cancelled) setEligible(false);
      });

    return () => {
      cancelled = true;
      if (openTimer) clearTimeout(openTimer);
      setEligible(false);
    };
  }, [canConsiderShowing, jwt]);

  function handleDismiss() {
    dismissInfraSupportModal();
    setEligible(false);
  }

  function handleDonate() {
    setEligible(false);
    router.push(INFRA_SUPPORT_DONATION_HREF);
  }

  return (
    <Dialog.Root open={open} onOpenChange={() => undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-950/10 outline-none"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title className="text-base font-semibold text-neutral-900">
            {INFRA_SUPPORT_MODAL_TITLE}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-neutral-600">
            {INFRA_SUPPORT_MODAL_DESCRIPTION}
          </Dialog.Description>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex min-h-9 w-full items-center justify-center rounded-xl border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:w-auto"
            >
              {INFRA_SUPPORT_MODAL_DISMISS_LABEL}
            </button>
            <button
              type="button"
              onClick={handleDonate}
              className={twMerge(saveBtn, 'w-full sm:w-auto hover:bg-emerald-700')}
            >
              {INFRA_SUPPORT_MODAL_DONATE_LABEL}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
