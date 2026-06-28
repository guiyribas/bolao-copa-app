'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import * as styles from './header.styles';

type HeaderNavLinkItemProps = {
  variant: 'desktop' | 'mobile';
  href: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
  title?: string;
  children: ReactNode;
};

export function HeaderNavLinkItem({
  variant,
  href,
  active,
  onNavigate,
  className,
  title,
  children,
}: HeaderNavLinkItemProps) {
  const linkClass =
    variant === 'desktop'
      ? styles.navLink(active, className)
      : styles.mobileNavLink(active, className);

  return (
    <Link href={href} className={linkClass} onClick={onNavigate} title={title}>
      {children}
    </Link>
  );
}
