import { twMerge } from 'tailwind-merge';

export const table = twMerge('w-full border-collapse text-sm');
export const headerRow = twMerge('border-b text-left');
export const row = twMerge('border-b');
export const posCell = twMerge('py-2 font-mono');
export const nameCell = twMerge('py-2');
export const pointsCell = twMerge('py-2 text-right tabular-nums');
export const pointsCellStrong = twMerge(pointsCell, 'font-bold');
export const pointsSubHeader = twMerge('py-2 text-right text-xs font-normal text-neutral-500');
