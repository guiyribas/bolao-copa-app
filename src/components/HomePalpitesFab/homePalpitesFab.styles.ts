import { twMerge } from 'tailwind-merge';

export const fabLink = twMerge(
  'fixed z-40 inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-transparent',
  'bg-linear-to-r from-emerald-800 via-emerald-900 to-emerald-950 px-3 py-2',
  'text-sm font-semibold text-yellow-50 shadow-sm shadow-emerald-950/25',
  'transition-[color,box-shadow,background-image]',
  'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
  'outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
  'bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]',
  'print:hidden'
);
