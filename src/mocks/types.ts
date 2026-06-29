import type { Match, Pool, PoolMembership, User } from '@/types';

export interface MockPersona {
  id: string;
  user: User;
  memberships: PoolMembership[];
  matches: Match[];
  /** Keyed by pool documentId for GET /api/pools/:id/session */
  poolSessions: Record<string, Pool>;
}
