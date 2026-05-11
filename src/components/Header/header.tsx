'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  HOME_PATH,
  MEUS_BOLOES_PATH,
  REGRAS_E_PONTUACAO_PATH,
  SOBRE_PATH,
} from '@/lib/navigation';
import { SITE_BRAND_LOGO_PATH } from '@/lib/site-brand';
import * as styles from './header.styles';

export function Header() {
  const pathname = usePathname();
  const { jwt, user, hasHydrated, logout } = useAuthStore();

  const isHomeActive = pathname === HOME_PATH;
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const showUserNav = hasHydrated && !!jwt && !isAuthPage;
  const showGuestNav = hasHydrated && !jwt;

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
              <span className={styles.logoUserName}>{user?.username}</span>
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
              <Link
                href="/login"
                className={styles.navLink(pathname === '/login')}
              >
                Entrar
              </Link>
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
              <Link
                href={MEUS_BOLOES_PATH}
                className={styles.navLink(pathname === MEUS_BOLOES_PATH)}
              >
                Bolões
              </Link>
              <Link
                href="/palpites"
                className={styles.navLink(pathname.startsWith('/palpites'))}
              >
                Palpites
              </Link>
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
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname === '/login')}
            >
              Entrar
            </Link>
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
              href="/palpites"
              onClick={() => setMenuOpen(false)}
              className={styles.mobileNavLink(pathname.startsWith('/palpites'))}
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
