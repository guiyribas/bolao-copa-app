import { twMerge } from 'tailwind-merge';

export const row = twMerge('inline-flex items-center gap-1.5 min-w-0 max-w-full');
export const name = twMerge('truncate font-medium');
export const flagPlaceholder = twMerge(
  'shrink-0 inline-flex items-center justify-center w-[22px] h-[16px]',
  'rounded-[2px] border border-neutral-200/80 bg-neutral-100 text-[10px] text-neutral-500 font-mono'
);

export const link = twMerge(
  'rounded-sm outline-none transition hover:text-emerald-900',
  'focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
);
