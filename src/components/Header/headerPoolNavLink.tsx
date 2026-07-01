'use client';

import Link from 'next/link';
import { useUserMemberships } from '@/contexts/user-memberships-context';
import { MEUS_BOLOES_PATH, poolRankingPath } from '@/lib/navigation';
import { HeaderPoolNavDropdown } from './components/headerPoolNavDropdown';
import { HeaderNavLinkItem } from './headerNavLinkItem';
import * as styles from './header.styles';
import {
  clipPoolNavLabel,
  isPoolPathActive,
  sortPoolMembershipsByName,
} from './headerPoolNavLink.utils';

type HeaderPoolNavLinkProps = {
  variant: 'desktop' | 'mobile';
  pathname: string;
  onNavigate?: () => void;
};

function HeaderPoolNavFallbackLink({
  variant,
  pathname,
  onNavigate,
}: HeaderPoolNavLinkProps) {
  return (
    <HeaderNavLinkItem
      variant={variant}
      href={MEUS_BOLOES_PATH}
      active={pathname === MEUS_BOLOES_PATH}
      onNavigate={onNavigate}
    >
      Bolões
    </HeaderNavLinkItem>
  );
}

function HeaderPoolNavMobileGroup({
  memberships,
  pathname,
  onNavigate,
}: {
  memberships: ReturnType<typeof useUserMemberships>['memberships'];
  pathname: string;
  onNavigate?: () => void;
}) {
  const sortedMemberships = sortPoolMembershipsByName(memberships);

  return (
    <div className={styles.poolNavMobileGroup}>
      <span className={styles.poolNavMobileLabel}>Bolões</span>
      <div className={styles.poolNavMobileSubList}>
        {sortedMemberships.map((membership) => {
          const poolId = membership.pool.documentId;
          const poolName = membership.pool.name.trim();
          const active = isPoolPathActive(pathname, poolId);

          return (
            <Link
              key={membership.documentId}
              href={poolRankingPath(poolId)}
              className={styles.poolNavMobileSubLink(active)}
              onClick={onNavigate}
            >
              {poolName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function HeaderPoolNavLink({
  variant,
  pathname,
  onNavigate,
}: HeaderPoolNavLinkProps) {
  const { memberships, loading } = useUserMemberships();

  if (loading || memberships.length === 0) {
    return (
      <HeaderPoolNavFallbackLink
        variant={variant}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }

  if (memberships.length === 1) {
    const membership = memberships[0];
    const poolId = membership.pool.documentId;
    const poolName = membership.pool.name.trim();
    const label = clipPoolNavLabel(poolName);

    return (
      <HeaderNavLinkItem
        variant={variant}
        href={poolRankingPath(poolId)}
        active={isPoolPathActive(pathname, poolId)}
        onNavigate={onNavigate}
        className={styles.navLinkLabelTruncate(variant)}
        title={poolName}
      >
        {label}
      </HeaderNavLinkItem>
    );
  }

  if (variant === 'mobile') {
    return (
      <HeaderPoolNavMobileGroup
        memberships={memberships}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    );
  }

  return <HeaderPoolNavDropdown memberships={memberships} pathname={pathname} />;
}
