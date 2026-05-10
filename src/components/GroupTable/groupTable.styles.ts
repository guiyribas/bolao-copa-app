import { twMerge } from 'tailwind-merge';

export const wrapper = twMerge('mb-6');
export const title = twMerge('font-bold mb-2');
export const table = twMerge('w-full border-collapse text-xs');
export const headerRow = twMerge('border-b text-left');
export const row = twMerge('border-b');
export const cellCenter = twMerge('py-1 text-center w-8');
export const cellPos = twMerge('py-1 w-6 font-mono');
export const cellTeam = twMerge('py-1 font-medium');
export const cellPoints = twMerge('py-1 text-center w-8 font-bold');
