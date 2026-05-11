import { isSameUser } from '@/lib/user-match';
import type { RankingEntry, User } from '@/types';

function rankingEntryAsUser(entry: RankingEntry): User {
  const userId = entry.userId.trim();
  const numericId = Number(userId);
  const hasNumericId = userId !== '' && !Number.isNaN(numericId);

  return {
    id: hasNumericId ? numericId : 0,
    documentId: hasNumericId ? undefined : userId || undefined,
    username: entry.username,
    email: '',
  };
}

export function isRankingEntryAdmin(
  entry: RankingEntry,
  admin?: User | null
): boolean {
  if (!admin) return false;
  return isSameUser(admin, rankingEntryAsUser(entry));
}
