'use client';

import { Toaster } from 'sonner';

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      duration={6000}
      toastOptions={{
        classNames: {
          toast: 'border border-neutral-200 bg-white text-neutral-900 shadow-lg',
        },
      }}
    />
  );
}
