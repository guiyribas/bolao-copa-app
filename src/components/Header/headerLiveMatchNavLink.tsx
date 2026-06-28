'use client';

import { useLiveMatch } from '@/hooks/useLiveMatch';
import { matchPageTitle } from '@/lib/match-metadata';
import { partidaPath } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { HeaderNavLinkItem } from './headerNavLinkItem';
import * as styles from './header.styles';

type HeaderLiveMatchNavLinkProps = {
  variant: 'desktop' | 'mobile';
  pathname: string;
  onNavigate?: () => void;
};

export function HeaderLiveMatchNavLink({
  variant,
  pathname,
  onNavigate,
}: HeaderLiveMatchNavLinkProps) {
  const { jwt, hasHydrated } = useAuthStore();
  const { liveMatch } = useLiveMatch(jwt, hasHydrated);

  if (!liveMatch) return null;

  const label = matchPageTitle(liveMatch);
  const href = partidaPath(liveMatch.documentId);
  const active = pathname === href;

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
