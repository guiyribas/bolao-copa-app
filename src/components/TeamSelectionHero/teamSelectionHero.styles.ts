import { twMerge } from 'tailwind-merge';

export const section = twMerge(
  'relative overflow-hidden rounded-2xl border border-emerald-900/10 bg-linear-to-br shadow-lg shadow-emerald-950/10 ring-1 ring-black/5',
  'from-emerald-950/6 via-white to-amber-50/35'
);

export const body = twMerge('relative px-5 py-8 sm:px-8 sm:py-10');

export const content = twMerge(
  'flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left'
);

export const flagImg = twMerge(
  'h-16 w-24 shrink-0 rounded-md border border-neutral-200/90 object-cover shadow-sm sm:h-20 sm:w-28'
);

export const flagPlaceholder = twMerge(
  'inline-flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100',
  'text-lg font-semibold text-neutral-500 sm:h-20 sm:w-28'
);

export const title = twMerge(
  'text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl'
);

export const code = twMerge('text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500');

export const metaRow = twMerge('mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start');

export const chip = twMerge(
  'rounded-full border bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700 shadow-sm'
);

export const fifaChip = twMerge(
  'rounded-full border border-emerald-700/25 bg-emerald-50/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-950 shadow-sm'
);
