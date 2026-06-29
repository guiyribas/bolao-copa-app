import type { PoolMembership } from '@/types';

export function pickPrimaryPoolMembership(
  memberships: PoolMembership[],
): PoolMembership | null {
  if (memberships.length === 0) {
    return null;
  }

  return [...memberships].sort((a, b) => {
    const rankA = a.rankingPlace ?? Infinity;
    const rankB = b.rankingPlace ?? Infinity;
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    const joinedA = new Date(a.joinedAt).getTime();
    const joinedB = new Date(b.joinedAt).getTime();
    if (joinedA !== joinedB) {
      return joinedA - joinedB;
    }

    return a.pool.name.localeCompare(b.pool.name, 'pt-BR');
  })[0] ?? null;
}
