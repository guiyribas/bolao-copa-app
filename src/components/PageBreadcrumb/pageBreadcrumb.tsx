import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Link from 'next/link';
import { Fragment } from 'react';
import { HOME_PATH } from '@/lib/navigation';

export type BreadcrumbSegment = {
  label: string;
  href: string;
};

type PageBreadcrumbProps = {
  /** Texto da página atual (último item da trilha). */
  label: string;
  /** Links entre a casinha e o item atual (ex.: Bolões). */
  segments?: BreadcrumbSegment[];
  className?: string;
};

export function PageBreadcrumb({
  label,
  segments = [],
  className,
}: PageBreadcrumbProps) {
  return (
    <nav aria-label="Trilha" className={className}>
      <ol className="flex flex-wrap items-center gap-0.5 text-sm text-neutral-600">
        <li className="flex items-center">
          <Link
            href={HOME_PATH}
            className="inline-flex rounded-sm text-neutral-700 outline-none transition hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label="Início"
          >
            <HomeOutlinedIcon
              className="size-4.5 shrink-0 text-neutral-700"
              aria-hidden
            />
          </Link>
        </li>
        {segments.map((seg) => (
          <Fragment key={seg.href}>
            <li className="flex items-center" aria-hidden>
              <ChevronRightIcon
                className="size-4 shrink-0 text-neutral-400"
                aria-hidden
              />
            </li>
            <li className="flex min-w-0 items-center">
              <Link
                href={seg.href}
                className="truncate rounded-sm font-normal text-neutral-700 underline decoration-neutral-300 underline-offset-2 outline-none transition hover:text-neutral-900 hover:decoration-neutral-500 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                {seg.label}
              </Link>
            </li>
          </Fragment>
        ))}
        <li className="flex items-center" aria-hidden>
          <ChevronRightIcon className="size-4 shrink-0 text-neutral-400" aria-hidden />
        </li>
        <li
          className="min-w-0 truncate font-medium text-neutral-900"
          aria-current="page"
        >
          {label}
        </li>
      </ol>
    </nav>
  );
}
