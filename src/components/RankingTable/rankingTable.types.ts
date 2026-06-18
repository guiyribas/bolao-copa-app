import type { RankingEntry, User } from '@/types';

export interface RankingTableProps {
  ranking: RankingEntry[];
  admin?: User | null;
  /** Deslocamento para paginação (ex.: página 2 com 20 por página → 20). */
  rankOffset?: number;
}
