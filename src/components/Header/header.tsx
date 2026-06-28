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
import { HeaderPoolNavLink } from './headerPoolNavLink';
import * as styles from './header.styles';

function formatHeaderUserLabel(
  user: Pick<User, 'username' | 'email'> | null | undefined
): string {
  if (!user?.username) return '';
  const email = user.email?.trim();
  if (!email) return user.username;
  return `${user.username} (${email})`;
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
  const { primaryMembership } = useUserMemberships();
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
    primaryMembership?.pool.name,
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
              <Link
                href={HOME_PATH}
                className={styles.navLink(isHomeActive)}
              >
                Partidas e resultados
              </Link>
              <Link
                href={MEUS_BOLOES_PATH}
                className={styles.navLink(pathname === MEUS_BOLOES_PATH)}
              >
                Bolões
              </Link>
              <Link
                href={RANKING_GLOBAL_PATH}
                className={styles.navLink(pathname === RANKING_GLOBAL_PATH)}
              >
                Ranking geral
              </Link>
              <Link
                href={REGRAS_E_PONTUACAO_PATH}
                className={styles.navLink(pathname === REGRAS_E_PONTUACAO_PATH)}
              >
                Regras e pontuação
              </Link>
              <Link
                href={SOBRE_PATH}
                className={styles.navLink(pathname === SOBRE_PATH)}
              >
                Sobre
              </Link>
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
              <Link
                href={HOME_PATH}
                className={styles.navLink(isHomeActive)}
              >
                Partidas e resultados
              </Link>
              <HeaderPoolNavLink variant="desktop" pathname={pathname} />
              <Link
                href={RANKING_GLOBAL_PATH}
                className={styles.navLink(pathname === RANKING_GLOBAL_PATH)}
              >
                Ranking geral
              </Link>
              {POOL_REQUESTS_ENABLED ? (
                <Link
                  href={CRIAR_BOLOAO_PATH}
                  className={styles.navLink(pathname === CRIAR_BOLOAO_PATH)}
                >
                  Criar bolão
                </Link>
              ) : null}
              <Link
                href="/palpites"
                className={styles.navLink(pathname.startsWith('/palpites'))}
              >
                Palpites
              </Link>
              <HeaderLiveMatchNavLink variant="desktop" pathname={pathname} />
              <Link
                href={REGRAS_E_PONTUACAO_PATH}
                className={styles.navLink(pathname === REGRAS_E_PONTUACAO_PATH)}
              >
                Regras
              </Link>
              <Link
                href={SOBRE_PATH}
                className={styles.navLink(pathname === SOBRE_PATH)}
              >
                Sobre
              </Link>
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
            <Link
              href={HOME_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(isHomeActive)}
            >
              Partidas e resultados
            </Link>
            <Link
              href={MEUS_BOLOES_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === MEUS_BOLOES_PATH)}
            >
              Bolões
            </Link>
            <Link
              href={RANKING_GLOBAL_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === RANKING_GLOBAL_PATH)}
            >
              Ranking geral
            </Link>
            <Link
              href={REGRAS_E_PONTUACAO_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(
                pathname === REGRAS_E_PONTUACAO_PATH
              )}
            >
              Regras e pontuação
            </Link>
            <Link
              href={SOBRE_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === SOBRE_PATH)}
            >
              Sobre
            </Link>
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
            <Link
              href={HOME_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(isHomeActive)}
            >
              Partidas e resultados
            </Link>
            <HeaderPoolNavLink
              variant="mobile"
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
            <Link
              href={RANKING_GLOBAL_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === RANKING_GLOBAL_PATH)}
            >
              Ranking geral
            </Link>
            {POOL_REQUESTS_ENABLED ? (
              <Link
                href={CRIAR_BOLOAO_PATH}
                onClick={() => setMenuOpen(false)}
                className={styles.mobileNavLink(pathname === CRIAR_BOLOAO_PATH)}
              >
                Criar bolão
              </Link>
            ) : null}
            <Link
              href="/palpites"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname.startsWith('/palpites'))}
            >
              Palpites
            </Link>
            <HeaderLiveMatchNavLink
              variant="mobile"
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
            <Link
              href={REGRAS_E_PONTUACAO_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(
                pathname === REGRAS_E_PONTUACAO_PATH
              )}
            >
              Regras e pontuação
            </Link>
            <Link
              href={SOBRE_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === SOBRE_PATH)}
            >
              Sobre
            </Link>
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
