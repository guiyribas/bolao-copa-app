import type { RankingEntry, User } from '@/types';

export interface RankingTableProps {
  ranking: RankingEntry[];
  admin?: User | null;
  /** Deslocamento para paginação (ex.: página 2 com 50 por página → 50). */
  rankOffset?: number;
}
