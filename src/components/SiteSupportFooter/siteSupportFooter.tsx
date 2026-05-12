'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SOBRE_PATH } from '@/lib/navigation';
import {
  SITE_SUPPORT_FOOTER_ARIA_LABEL,
  SITE_SUPPORT_FOOTER_EMOJI,
  SITE_SUPPORT_FOOTER_LABEL,
  SITE_SUPPORT_FOOTER_SUPPORT_SECTION_ID,
} from './siteSupportFooter.constants';
import * as styles from './siteSupportFooter.styles';

export function SiteSupportFooter() {
  const pathname = usePathname();
  if (pathname === SOBRE_PATH) return null;

  return (
    <footer className={styles.footer}>
      <Link
        href={`${SOBRE_PATH}#${SITE_SUPPORT_FOOTER_SUPPORT_SECTION_ID}`}
        className={styles.link}
        aria-label={SITE_SUPPORT_FOOTER_ARIA_LABEL}
      >
        <span aria-hidden>{SITE_SUPPORT_FOOTER_EMOJI}</span>
        {SITE_SUPPORT_FOOTER_LABEL}
      </Link>
    </footer>
  );
}
