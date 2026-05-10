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
  'text-sm font-medium transition-colors',
  'outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2'
);

const inactive = 'border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50';
const active = 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800';

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
