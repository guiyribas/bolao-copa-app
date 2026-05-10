import { twMerge } from 'tailwind-merge';

export const wrapper = twMerge(
  'rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-950/5 overflow-hidden'
);
export const table = twMerge('w-full border-collapse text-sm');
export const thead = twMerge('bg-neutral-50');
export const headerRow = twMerge(
  'border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500'
);
export const row = twMerge(
  'border-b border-neutral-100 last:border-0 transition-colors hover:bg-neutral-50/80'
);
export const rowGold = twMerge(
  row,
  'bg-gradient-to-r from-amber-100/95 via-yellow-50 to-amber-50/60 border-l-4 border-l-amber-500 hover:from-amber-100 hover:via-yellow-50'
);
export const rowSilver = twMerge(
  row,
  'bg-gradient-to-r from-slate-100 to-neutral-50 border-l-4 border-l-slate-400 hover:from-slate-100'
);
export const rowBronze = twMerge(
  row,
  'bg-gradient-to-r from-orange-100/90 to-amber-50/70 border-l-4 border-l-amber-800 hover:from-orange-100'
);
export const posCell = twMerge('py-3 pl-3 pr-2 font-mono tabular-nums');
export const posGold = twMerge(posCell, 'font-semibold text-amber-800');
export const posSilver = twMerge(posCell, 'font-semibold text-slate-600');
export const posBronze = twMerge(posCell, 'font-semibold text-amber-900');
export const nameCell = twMerge('py-3 pr-2');
export const nameCellMedal = twMerge(nameCell, 'font-semibold text-neutral-900');
export const pointsCell = twMerge('py-3 px-2 text-right tabular-nums text-neutral-700');
export const pointsCellStrong = twMerge(pointsCell, 'font-bold text-neutral-900');
/** Mesma tipografia das colunas de pontos, alinhada à esquerda (nome). */
export const nameSubHeader = twMerge(
  'py-3 pr-2 text-left align-middle text-[11px] font-medium normal-case tracking-normal text-neutral-500'
);

export const pointsSubHeader = twMerge(
  'py-3 px-2 text-right text-[11px] font-medium normal-case tracking-normal text-neutral-500'
);
