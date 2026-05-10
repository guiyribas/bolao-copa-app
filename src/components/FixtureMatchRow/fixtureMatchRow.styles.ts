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
export const meta = twMerge(
  'basis-full flex flex-wrap items-center gap-x-2 gap-y-1 justify-between text-xs text-neutral-500 mt-1'
);

/** Detalhes da partida à esquerda, link à direita (space-between; em mobile ocupa linha cheia após o badge). */
export const metaDetailRow = twMerge(
  'flex min-w-0 flex-1 basis-full items-center justify-between gap-x-2 gap-y-1 sm:basis-0'
);
export const badge = twMerge('text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border');

/** Atalho textual para `/partida/...` (neutro; partilhado com MatchCard). */
export const matchDetailTextLinkClass = twMerge(
  'text-xs text-neutral-500 font-medium',
  'underline decoration-neutral-300 underline-offset-2',
  'hover:text-neutral-900 hover:decoration-neutral-500',
  'inline-flex items-center gap-0.5 shrink-0',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 rounded-sm'
);
