'use client';

import { useUserMemberships } from '@/contexts/user-memberships-context';
import { MEUS_BOLOES_PATH, poolRankingPath } from '@/lib/navigation';
import { HeaderNavLinkItem } from './headerNavLinkItem';
import * as styles from './header.styles';

type HeaderPoolNavLinkProps = {
  variant: 'desktop' | 'mobile';
  pathname: string;
  onNavigate?: () => void;
};

export function HeaderPoolNavLink({
  variant,
  pathname,
  onNavigate,
}: HeaderPoolNavLinkProps) {
  const { primaryMembership, loading } = useUserMemberships();

  const poolId = primaryMembership?.pool.documentId;
  const poolName = primaryMembership?.pool.name?.trim();
  const usePoolLink = !loading && !!poolId && !!poolName;

  const href = usePoolLink ? poolRankingPath(poolId) : MEUS_BOLOES_PATH;
  const label = usePoolLink ? poolName : 'Bolões';
  const active = usePoolLink
    ? pathname.startsWith(`/pool/${poolId}/`)
    : pathname === MEUS_BOLOES_PATH;

  return (
    <HeaderNavLinkItem
      variant={variant}
      href={href}
      active={active}
      onNavigate={onNavigate}
      className={styles.navLinkLabelTruncate(variant)}
      title={label}
    >
      {label}
    </HeaderNavLinkItem>
  );
}
