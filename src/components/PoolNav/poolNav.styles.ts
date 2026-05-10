import { twMerge } from 'tailwind-merge';

export const nav = twMerge('flex gap-4 border-b mb-6');

export function tabLink(active: boolean, className?: string) {
  return twMerge(
    'pb-2 text-sm',
    active && 'border-b-2 border-black font-bold',
    className
  );
}
