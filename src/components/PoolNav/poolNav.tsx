'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PoolNavProps } from './poolNav.types';
import { TABS, ADMIN_TAB } from './poolNav.constants';
import * as styles from './poolNav.styles';

export function PoolNav({ poolId, isAdmin }: PoolNavProps) {
  const pathname = usePathname();
  const allTabs = isAdmin ? [...TABS, ADMIN_TAB] : TABS;

  return (
    <nav className={styles.nav}>
      {allTabs.map((tab) => {
        const href = `/pool/${poolId}/${tab.segment}`;
        const active = pathname === href;
        return (
          <Link key={tab.segment} href={href} className={styles.tabLink(active)}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
