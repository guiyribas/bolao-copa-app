import { twMerge } from 'tailwind-merge';

/** Duas linhas: times + placar centralizados; meta abaixo evita flex-wrap que zerava as colunas dos times. */
export const card = twMerge(
  'border border-neutral-200 rounded p-3 flex flex-col gap-2 text-sm'
);

/** Partida ao vivo: destaque sem sombra grande (evita “manchar” o card seguinte na lista). */
export const cardLive = twMerge(
  'relative ring-2 ring-red-500/35 shadow-sm shadow-neutral-900/10'
);

/** Mobile: times + placar numa linha; Salvar em linha cheia abaixo. sm+: tudo numa linha. */
export const mainRow = twMerge(
  'flex w-full flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-3 min-h-[2.25rem]'
);
export const matchLine = twMerge(
  'flex min-h-[2.25rem] w-full min-w-0 flex-nowrap items-center gap-2 sm:gap-3'
);

/** Lateral com largura mínima para bandeira + nome não sumirem com flex-shrink. */
export const teamColHome = twMerge(
  'flex min-w-[6rem] flex-1 justify-end overflow-hidden sm:min-w-[7rem]'
);
export const teamColAway = twMerge(
  'flex min-w-[6rem] flex-1 justify-start overflow-hidden sm:min-w-[7rem]'
);

export const scoreCluster = twMerge('flex shrink-0 items-center gap-1');
export const teamName = twMerge('font-medium');
export const scoreInput = twMerge('w-10 border text-center rounded py-1');
export const scoreDisplay = twMerge('w-6 text-center');
export const saveBtn = twMerge(
  'inline-flex w-full shrink-0 sm:w-auto sm:min-w-[5.5rem]',
  'min-h-9 items-center justify-center self-stretch sm:self-auto',
  'rounded-xl px-3 py-2 text-sm font-semibold text-yellow-50',
  'bg-linear-to-r from-emerald-800 via-emerald-900 to-emerald-950',
  'shadow-md shadow-emerald-950/25 transition-[background-image,box-shadow]',
  'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'disabled:hover:from-emerald-800 disabled:hover:via-emerald-900 disabled:hover:to-emerald-950'
);
export const saveBtnSaved = twMerge(
  'inline-flex w-full shrink-0 sm:w-auto sm:min-w-[5.5rem]',
  'min-h-9 items-center justify-center self-stretch sm:self-auto',
  'rounded-xl px-3 py-2 text-sm font-semibold',
  'border border-emerald-200 bg-emerald-50 text-emerald-800',
  'disabled:cursor-default disabled:opacity-100'
);
export const saveBtnInner = twMerge(
  'inline-flex min-h-[1.25rem] w-full items-center justify-center gap-1'
);
export const inlinePoints = twMerge(
  'inline-flex w-full shrink-0 sm:w-auto sm:min-w-[5.5rem]',
  'min-h-9 items-center justify-center self-stretch sm:self-auto',
  'gap-2 rounded-md px-3 py-2 text-sm',
  'border border-neutral-200 bg-neutral-50'
);
export const resultInfo = twMerge('text-xs tabular-nums text-gray-500');
export const dateLabel = twMerge('text-xs text-gray-400');
/** Data + placar real centrados no meio da linha; pontos na coluna direita (grid 1fr / auto / 1fr). */
export const metaBlock = twMerge(
  'grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-2 border-t border-neutral-100 pt-2'
);
export const metaCenter = twMerge(
  'flex flex-col items-center justify-center gap-0.5 text-center min-w-0'
);
export const metaSideEnd = twMerge('justify-self-end min-w-0');
export const pointsRow = twMerge('flex items-center gap-2 text-xs');
export const pointsLabel = twMerge('hidden text-neutral-600 sm:inline');
export const pointsValue = twMerge('font-semibold text-green-700 tabular-nums');
export const pointsValueZero = twMerge('font-semibold text-red-600 tabular-nums');
