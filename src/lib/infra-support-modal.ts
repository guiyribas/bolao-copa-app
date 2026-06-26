import { SITE_SUPPORT_FOOTER_SUPPORT_SECTION_ID } from '@/components/SiteSupportFooter/siteSupportFooter.constants';
import {
  FORGOT_PASSWORD_PATH,
  isGoogleAuthCallbackPath,
  RESET_PASSWORD_PATH,
  SOBRE_PATH,
} from '@/lib/navigation';
import type { PoolMembership } from '@/types';

export const INFRA_SUPPORT_MODAL_STORAGE_KEY = 'bolao-infra-support-dismissed-v2';

/** IDs numéricos do Strapi em produção. */
export const INFRA_SUPPORT_MODAL_EXCLUDED_POOL_IDS = new Set([5, 34, 37]); // PROD
// export const INFRA_SUPPORT_MODAL_EXCLUDED_POOL_IDS = new Set([5]); // DEV

export const INFRA_SUPPORT_MODAL_TITLE =
  'O site está lento? Considere fazer uma contribuição!';

export const INFRA_SUPPORT_MODAL_DESCRIPTION =
  'Com quase 300 usuários ativos e mais de 16 mil palpites registrados, a plataforma está no limite da capacidade atual. Se cada um contribuir com R$ 1, conseguimos aumentar o plano e suportar mais acessos simultâneos durante a Copa.';

export const INFRA_SUPPORT_MODAL_DONATE_LABEL = 'Quero contribuir';
export const INFRA_SUPPORT_MODAL_DISMISS_LABEL = 'Já contribuí';

export const INFRA_SUPPORT_DONATION_HREF = `${SOBRE_PATH}#${SITE_SUPPORT_FOOTER_SUPPORT_SECTION_ID}`;

/** Delay antes de abrir o modal após elegibilidade confirmada. */
export const INFRA_SUPPORT_MODAL_OPEN_DELAY_MS = 500;

const AUTH_PATHS = new Set(['/login', '/register']);

export function isInfraSupportModalDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(INFRA_SUPPORT_MODAL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissInfraSupportModal(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INFRA_SUPPORT_MODAL_STORAGE_KEY, '1');
  } catch {
    // ignore quota / private mode
  }
}

function pickPoolNumericId(pool: PoolMembership['pool']): number | undefined {
  if (pool.id != null && pool.id > 0) return pool.id;

  const idRaw = (pool as unknown as Record<string, unknown>).id;
  if (typeof idRaw === 'number' && idRaw > 0) return idRaw;
  if (typeof idRaw === 'string') {
    const parsed = Number(idRaw);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  return undefined;
}

export function userBelongsToExcludedPool(
  memberships: PoolMembership[]
): boolean {
  return memberships.some((membership) => {
    const poolId = pickPoolNumericId(membership.pool);
    return poolId != null && INFRA_SUPPORT_MODAL_EXCLUDED_POOL_IDS.has(poolId);
  });
}

export function isInfraSupportModalSuppressedPath(pathname: string): boolean {
  return (
    pathname === SOBRE_PATH ||
    AUTH_PATHS.has(pathname) ||
    pathname === FORGOT_PASSWORD_PATH ||
    pathname === RESET_PASSWORD_PATH ||
    isGoogleAuthCallbackPath(pathname)
  );
}
