'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type FilterPillProps = {
  selected: boolean;
  children: ReactNode;
  'aria-label'?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'aria-pressed'>;

const base = twMerge(
  'inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3 py-2',
  'text-sm font-semibold transition-[color,box-shadow,background-image]',
  'outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
);

const inactive = 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50';
const active = twMerge(
  'border-transparent text-yellow-50 shadow-sm shadow-emerald-950/25',
  'bg-linear-to-r from-emerald-800 via-emerald-900 to-emerald-950',
  'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900'
);

export function FilterPill({
  selected,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={twMerge(base, selected ? active : inactive, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
