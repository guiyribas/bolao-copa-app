import { twMerge } from 'tailwind-merge';

export const scrollWrap = twMerge(
  'overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950',
  'shadow-inner px-3 py-4 sm:px-4'
);

export const grid = twMerge(
  'grid min-w-[820px] sm:min-w-[920px]',
  'gap-x-0 gap-y-0'
);

export const phaseTitle = twMerge(
  'text-[11px] font-semibold uppercase tracking-wide text-neutral-500',
  'text-center pb-2 pt-0 px-1 border-b border-neutral-800 mb-1'
);

export const columnDivider = 'border-r border-neutral-800/90';

/** Base visual do card; altura fixa vem de `BRACKET_CARD_HEIGHT_REM` no componente. */
export const card = twMerge(
  'rounded-lg border border-neutral-700/90 bg-neutral-900/95',
  'px-2 py-1 flex flex-col gap-0.5 justify-center shrink-0 w-full overflow-hidden',
  'shadow-sm'
);

export const cardClickable = twMerge(
  card,
  'transition-colors hover:border-emerald-500/60 hover:bg-neutral-800/80 cursor-pointer'
);

export const cardCell = twMerge(
  'flex items-center justify-center min-h-0 px-1 py-0.5 box-border'
);

export const cardDate = twMerge('text-[10px] text-neutral-500 tabular-nums leading-tight');

export const teamRow = twMerge('flex items-center gap-1.5 min-h-[18px] text-[11px] leading-tight');

export const teamName = twMerge('text-neutral-100 truncate');

export const scoreInline = twMerge('ml-auto shrink-0 tabular-nums text-neutral-400 font-mono text-[10px]');

export const placeholderIcon = twMerge(
  'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm',
  'bg-neutral-700/80 text-[9px] text-neutral-400'
);

export const placeholderLabel = twMerge('text-neutral-400 italic');
