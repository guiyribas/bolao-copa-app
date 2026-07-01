'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserMemberships } from '@/contexts/user-memberships-context';
import { useLiveMatch } from '@/hooks/useLiveMatch';
import { useAuthStore } from '@/stores/auth-store';
import {
  CRIAR_BOLOAO_PATH,
  FORGOT_PASSWORD_PATH,
  HOME_PATH,
  isGoogleAuthCallbackPath,
  MEUS_BOLOES_PATH,
  RANKING_GLOBAL_PATH,
  REGRAS_E_PONTUACAO_PATH,
  RESET_PASSWORD_PATH,
  SOBRE_PATH,
} from '@/lib/navigation';
import { POOL_REQUESTS_ENABLED } from '@/lib/pool-requests';
import { SITE_BRAND_LOGO_PATH } from '@/lib/site-brand';
import type { User } from '@/types';
import { HeaderLiveMatchNavLink } from './headerLiveMatchNavLink';
import { HeaderNavLinkItem } from './headerNavLinkItem';
import { HeaderPoolNavLink } from './headerPoolNavLink';
import * as styles from './header.styles';

function formatHeaderUserLabel(
  user: Pick<User, 'username'> | null | undefined
): string {
  return user?.username?.trim() ?? '';
}

export function Header() {
  const pathname = usePathname();
  const { jwt, user, hasHydrated, logout } = useAuthStore();
  const headerRef = useRef<HTMLElement>(null);

  const isHomeActive = pathname === HOME_PATH;
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === FORGOT_PASSWORD_PATH ||
    pathname === RESET_PASSWORD_PATH ||
    isGoogleAuthCallbackPath(pathname);
  const showUserNav = hasHydrated && !!jwt && !isAuthPage;
  const showGuestNav = hasHydrated && !jwt;
  const headerUserLabel = formatHeaderUserLabel(user);
  const { memberships } = useUserMemberships();
  const { liveMatch } = useLiveMatch(jwt, hasHydrated);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    queueMicrotask(() => setMenuOpen(false));
  }, [pathname]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-header-height',
        `${el.offsetHeight}px`
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [
    showUserNav,
    showGuestNav,
    headerUserLabel,
    memberships.length,
    memberships.map((m) => m.pool.name).join('|'),
    liveMatch?.documentId,
  ]);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href={HOME_PATH}
          className={
            showUserNav ? styles.logoLinkWithUser : styles.logoLink
          }
        >
          <Image
            src={SITE_BRAND_LOGO_PATH}
            alt=""
            width={260}
            height={72}
            priority
            className={styles.logoImage}
          />
          {showUserNav ? (
            <div className={styles.logoTextColumn}>
              <span className={styles.logoTitle}>Bolão Copa 2026</span>
              <span className={styles.logoUserName} title={headerUserLabel}>
                {headerUserLabel}
              </span>
            </div>
          ) : (
            <span className={styles.logoTitle}>Bolão Copa 2026</span>
          )}
        </Link>

        {showGuestNav && (
          <>
            <nav className={styles.desktopNav} aria-label="Principal">
              <HeaderNavLinkItem
                variant="desktop"
                href={HOME_PATH}
                active={isHomeActive}
              >
                Partidas e resultados
              </HeaderNavLinkItem>
              <HeaderNavLinkItem
                variant="desktop"
                href={MEUS_BOLOES_PATH}
                active={pathname === MEUS_BOLOES_PATH}
              >
                Bolões
              </HeaderNavLinkItem>
              <HeaderNavLinkItem
                variant="desktop"
                href={RANKING_GLOBAL_PATH}
                active={pathname === RANKING_GLOBAL_PATH}
              >
                Ranking geral
              </HeaderNavLinkItem>
              <HeaderNavLinkItem
                variant="desktop"
                href={REGRAS_E_PONTUACAO_PATH}
                active={pathname === REGRAS_E_PONTUACAO_PATH}
              >
                Regras e pontuação
              </HeaderNavLinkItem>
              <HeaderNavLinkItem
                variant="desktop"
                href={SOBRE_PATH}
                active={pathname === SOBRE_PATH}
              >
                Sobre
              </HeaderNavLinkItem>
              <div className={styles.guestAuthActions}>
                <Link
                  href="/login"
                  className={styles.guestAuthLoginLink(pathname === '/login')}
                >
                  <span className={styles.guestAuthIcon} aria-hidden>
                    login
                  </span>
                  Login
                </Link>
                <Link
                  href="/register"
                  className={styles.guestAuthRegisterButton(
                    pathname === '/register'
                  )}
                >
                  <span className={styles.guestAuthIcon} aria-hidden>
                    person_add
                  </span>
                  Criar conta
                </Link>
              </div>
            </nav>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className={styles.hamburgerButton}
            >
              <span className="material-symbols-outlined" aria-hidden>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </>
        )}

        {showUserNav && (
          <>
            <nav className={styles.desktopNav} aria-label="Principal">
              <HeaderNavLinkItem
                variant="desktop"
                href={HOME_PATH}
                active={isHomeActive}
              >
                Partidas e resultados
              </HeaderNavLinkItem>
              <HeaderPoolNavLink variant="desktop" pathname={pathname} />
              <HeaderNavLinkItem
                variant="desktop"
                href={RANKING_GLOBAL_PATH}
                active={pathname === RANKING_GLOBAL_PATH}
              >
                Ranking geral
              </HeaderNavLinkItem>
              {POOL_REQUESTS_ENABLED ? (
                <HeaderNavLinkItem
                  variant="desktop"
                  href={CRIAR_BOLOAO_PATH}
                  active={pathname === CRIAR_BOLOAO_PATH}
                >
                  Criar bolão
                </HeaderNavLinkItem>
              ) : null}
              <HeaderNavLinkItem
                variant="desktop"
                href="/palpites"
                active={pathname.startsWith('/palpites')}
              >
                Palpites
              </HeaderNavLinkItem>
              <HeaderLiveMatchNavLink variant="desktop" pathname={pathname} />
              <HeaderNavLinkItem
                variant="desktop"
                href={REGRAS_E_PONTUACAO_PATH}
                active={pathname === REGRAS_E_PONTUACAO_PATH}
              >
                Regras
              </HeaderNavLinkItem>
              <HeaderNavLinkItem
                variant="desktop"
                href={SOBRE_PATH}
                active={pathname === SOBRE_PATH}
              >
                Sobre
              </HeaderNavLinkItem>
              <button
                type="button"
                onClick={logout}
                className={styles.logoutButton}
              >
                Sair
              </button>
            </nav>

            <button
              type="button"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((open) => !open)}
              className={styles.hamburgerButton}
            >
              <span className="material-symbols-outlined" aria-hidden>
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </>
        )}
      </div>

      {menuOpen && showGuestNav && (
        <div
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.mobileOverlayBar}>
            <Link
              href={HOME_PATH}
              className={styles.logoLink}
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={SITE_BRAND_LOGO_PATH}
                alt=""
                width={260}
                height={72}
                className={styles.logoImage}
              />
              <span className={styles.logoTitle}>Bolão Copa 2026</span>
            </Link>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className={styles.hamburgerButton}
            >
              <span className="material-symbols-outlined" aria-hidden>
                close
              </span>
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label="Principal">
            <HeaderNavLinkItem
              variant="mobile"
              href={HOME_PATH}
              active={isHomeActive}
              onNavigate={() => setMenuOpen(false)}
            >
              Partidas e resultados
            </HeaderNavLinkItem>
            <HeaderNavLinkItem
              variant="mobile"
              href={MEUS_BOLOES_PATH}
              active={pathname === MEUS_BOLOES_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Bolões
            </HeaderNavLinkItem>
            <HeaderNavLinkItem
              variant="mobile"
              href={RANKING_GLOBAL_PATH}
              active={pathname === RANKING_GLOBAL_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Ranking geral
            </HeaderNavLinkItem>
            <HeaderNavLinkItem
              variant="mobile"
              href={REGRAS_E_PONTUACAO_PATH}
              active={pathname === REGRAS_E_PONTUACAO_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Regras e pontuação
            </HeaderNavLinkItem>
            <HeaderNavLinkItem
              variant="mobile"
              href={SOBRE_PATH}
              active={pathname === SOBRE_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Sobre
            </HeaderNavLinkItem>
            <div className={styles.mobileGuestAuthActions}>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className={styles.mobileGuestAuthLoginLink(
                  pathname === '/login'
                )}
              >
                <span className={styles.guestAuthIcon} aria-hidden>
                  login
                </span>
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className={styles.mobileGuestAuthRegisterButton(
                  pathname === '/register'
                )}
              >
                <span className={styles.guestAuthIcon} aria-hidden>
                  person_add
                </span>
                Criar conta
              </Link>
            </div>
          </nav>
        </div>
      )}

      {menuOpen && showUserNav && (
        <div
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.mobileOverlayBar}>
            <Link
              href={HOME_PATH}
              className={styles.logoLinkWithUser}
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src={SITE_BRAND_LOGO_PATH}
                alt=""
                width={260}
                height={72}
                className={styles.logoImage}
              />
              <div className={styles.logoTextColumn}>
                <span className={styles.logoTitle}>Bolão Copa 2026</span>
                <span className={styles.logoUserName} title={headerUserLabel}>
                  {headerUserLabel}
                </span>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className={styles.hamburgerButton}
            >
              <span className="material-symbols-outlined" aria-hidden>
                close
              </span>
            </button>
          </div>

          <nav className={styles.mobileNav} aria-label="Principal">
            <HeaderNavLinkItem
              variant="mobile"
              href={HOME_PATH}
              active={isHomeActive}
              onNavigate={() => setMenuOpen(false)}
            >
              Partidas e resultados
            </HeaderNavLinkItem>
            <HeaderPoolNavLink
              variant="mobile"
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
            <HeaderNavLinkItem
              variant="mobile"
              href={RANKING_GLOBAL_PATH}
              active={pathname === RANKING_GLOBAL_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Ranking geral
            </HeaderNavLinkItem>
            {POOL_REQUESTS_ENABLED ? (
              <HeaderNavLinkItem
                variant="mobile"
                href={CRIAR_BOLOAO_PATH}
                active={pathname === CRIAR_BOLOAO_PATH}
                onNavigate={() => setMenuOpen(false)}
              >
                Criar bolão
              </HeaderNavLinkItem>
            ) : null}
            <HeaderNavLinkItem
              variant="mobile"
              href="/palpites"
              active={pathname.startsWith('/palpites')}
              onNavigate={() => setMenuOpen(false)}
            >
              Palpites
            </HeaderNavLinkItem>
            <HeaderLiveMatchNavLink
              variant="mobile"
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
            <HeaderNavLinkItem
              variant="mobile"
              href={REGRAS_E_PONTUACAO_PATH}
              active={pathname === REGRAS_E_PONTUACAO_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Regras e pontuação
            </HeaderNavLinkItem>
            <HeaderNavLinkItem
              variant="mobile"
              href={SOBRE_PATH}
              active={pathname === SOBRE_PATH}
              onNavigate={() => setMenuOpen(false)}
            >
              Sobre
            </HeaderNavLinkItem>
            <button
              type="button"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className={styles.mobileLogoutButton}
            >
              Sair
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
