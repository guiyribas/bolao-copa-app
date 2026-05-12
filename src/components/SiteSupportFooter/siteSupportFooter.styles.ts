import { twMerge } from 'tailwind-merge';

export const footer = twMerge(
  'w-full border-t border-neutral-200/80 bg-black/2 px-4 py-3 text-center',
  'text-[11px] text-neutral-900 sm:text-xs',
  'print:hidden'
);

export const link = twMerge(
  'inline-flex items-center justify-center gap-1.5 rounded-sm text-neutral-900 outline-none',
  'transition-opacity hover:underline hover:opacity-80',
  'focus-visible:underline focus-visible:opacity-80',
  'focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2'
);
