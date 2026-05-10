'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  HOME_PATH,
  HOME_TAB_QUERY_KEY,
  MEUS_BOLOES_PATH,
  REGRAS_E_PONTUACAO_PATH,
} from '@/lib/navigation';
import * as styles from './header.styles';

const BRAND_IMAGE = '/WC26_Logo.avif';

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { jwt, user, hasHydrated, logout } = useAuthStore();

  const homeTabParam = searchParams.get(HOME_TAB_QUERY_KEY);
  const isHomeAllMatchesActive =
    pathname === HOME_PATH &&
    (homeTabParam === null ||
      homeTabParam === '' ||
      homeTabParam === 'all');
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const showNav = hasHydrated && !!jwt && !isAuthPage;
  const showPublicRulesLink = hasHydrated && !jwt && !isAuthPage;

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

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={HOME_PATH} className={styles.logoLink}>
          <Image
            src={BRAND_IMAGE}
            alt=""
            width={260}
            height={72}
            priority
            className={styles.logoImage}
          />
          {showNav ? (
            <div className={styles.logoTextColumn}>
              <span className={styles.logoTitle}>Bolão Copa 2026</span>
              <span className={styles.logoUserName}>{user?.username}</span>
            </div>
          ) : (
            <span className={styles.logoTitle}>Bolão Copa 2026</span>
          )}
        </Link>

        {showPublicRulesLink && (
          <nav className="ml-auto md:ml-0" aria-label="Informações">
            <Link
              href={REGRAS_E_PONTUACAO_PATH}
              className={styles.navLink(pathname === REGRAS_E_PONTUACAO_PATH)}
            >
              Regras e pontuação
            </Link>
          </nav>
        )}

        {showNav && (
          <>
            <nav className={styles.desktopNav} aria-label="Principal">
              <Link
                href={`${HOME_PATH}?${HOME_TAB_QUERY_KEY}=all`}
                className={styles.navLink(isHomeAllMatchesActive)}
              >
                Todas as partidas
              </Link>
              <Link
                href={MEUS_BOLOES_PATH}
                className={styles.navLink(pathname === MEUS_BOLOES_PATH)}
              >
                Meus bolões
              </Link>
              <Link
                href="/palpites"
                className={styles.navLink(pathname === '/palpites')}
              >
                Palpites
              </Link>
              <Link
                href={REGRAS_E_PONTUACAO_PATH}
                className={styles.navLink(pathname === REGRAS_E_PONTUACAO_PATH)}
              >
                Regras
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

      {menuOpen && showNav && (
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
                src={BRAND_IMAGE}
                alt=""
                width={260}
                height={72}
                className={styles.logoImage}
              />
              <div className={styles.logoTextColumn}>
                <span className={styles.logoTitle}>Bolão Copa 2026</span>
                <span className={styles.logoUserName}>{user?.username}</span>
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
              href={`${HOME_PATH}?${HOME_TAB_QUERY_KEY}=all`}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(isHomeAllMatchesActive)}
            >
              Todas as partidas
            </Link>
            <Link
              href={MEUS_BOLOES_PATH}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === MEUS_BOLOES_PATH)}
            >
              Meus bolões
            </Link>
            <Link
              href="/palpites"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === '/palpites')}
            >
              Palpites
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
