'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { poolRankingPath } from '@/lib/navigation';
import type { PoolMembership } from '@/types';
import * as styles from '../header.styles';
import {
  isPoolPathActive,
  sortPoolMembershipsByName,
} from '../headerPoolNavLink.utils';

type HeaderPoolNavDropdownProps = {
  memberships: PoolMembership[];
  pathname: string;
};

export function HeaderPoolNavDropdown({
  memberships,
  pathname,
}: HeaderPoolNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const sortedMemberships = sortPoolMembershipsByName(memberships);
  const activePoolId = sortedMemberships.find((m) =>
    isPoolPathActive(pathname, m.pool.documentId),
  )?.pool.documentId;
  const triggerActive = !!activePoolId;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (!next || !rootRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={styles.poolNavDropdownRoot}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
    >
      <button
        type="button"
        className={styles.poolNavDropdownTrigger(triggerActive)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        Bolões
        <span
          className={
            open
              ? styles.poolNavDropdownChevronOpen()
              : styles.poolNavDropdownChevron
          }
          aria-hidden
        >
          expand_more
        </span>
      </button>

      {open ? (
        <div className={styles.poolNavDropdownPanelWrap}>
          <div
            id={menuId}
            role="menu"
            aria-label="Bolões"
            className={styles.poolNavDropdownPanel}
          >
            {sortedMemberships.map((membership) => {
              const poolId = membership.pool.documentId;
              const poolName = membership.pool.name.trim();
              const active = isPoolPathActive(pathname, poolId);

              return (
                <Link
                  key={membership.documentId}
                  href={poolRankingPath(poolId)}
                  role="menuitem"
                  className={styles.poolNavDropdownItem(active)}
                  title={poolName}
                >
                  {poolName}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
