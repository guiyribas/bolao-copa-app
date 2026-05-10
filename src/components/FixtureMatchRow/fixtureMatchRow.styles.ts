import { twMerge } from 'tailwind-merge';

export const row = twMerge(
  'border rounded-lg p-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm',
  'bg-white shadow-sm border-neutral-200'
);

export const rowLive = twMerge(
  'relative ring-2 ring-red-500/35 shadow-sm shadow-neutral-900/10'
);
export const side = twMerge('flex-1 min-w-[8rem]');
export const sideHome = twMerge('flex-1 min-w-[8rem] flex justify-end text-right');
export const scores = twMerge('flex items-center gap-2 font-mono font-semibold shrink-0');
export const meta = twMerge('basis-full flex justify-between text-xs text-neutral-500 mt-1');
export const badge = twMerge('text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border');
