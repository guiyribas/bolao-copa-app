import { POOL_NAV_NAME_MAX_LEN } from './headerPoolNavLink.constants';

export function clipPoolNavLabel(name: string): string {
  if (name.length <= POOL_NAV_NAME_MAX_LEN) return name;
  return `${name.slice(0, POOL_NAV_NAME_MAX_LEN)}...`;
}

export function sortPoolMembershipsByName<T extends { pool: { name: string } }>(
  memberships: T[],
): T[] {
  return [...memberships].sort((a, b) =>
    a.pool.name.localeCompare(b.pool.name, 'pt-BR'),
  );
}

export function isPoolPathActive(pathname: string, poolDocumentId: string): boolean {
  return pathname.startsWith(`/pool/${poolDocumentId}/`);
}
