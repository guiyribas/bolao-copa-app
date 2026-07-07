'use client';

import { useLiveMatch } from '@/hooks/useLiveMatch';
import { matchPageTitle } from '@/lib/match-metadata';
import { partidaPath } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { HeaderNavLinkItem } from './headerNavLinkItem';
import * as styles from './header.styles';

type HeaderLiveMatchNavLinkProps = {
  pathname: string;
  onNavigate?: () => void;
};

export function HeaderLiveMatchNavLink({
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
      variant="mobile"
      href={href}
      active={active}
      onNavigate={onNavigate}
      className={styles.navLinkLabelTruncate('mobile')}
      title={label}
    >
      {label}
    </HeaderNavLinkItem>
  );
}
