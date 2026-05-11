import type { RankingEntry, User } from '@/types';

export interface RankingTableProps {
  ranking: RankingEntry[];
  admin?: User | null;
}
