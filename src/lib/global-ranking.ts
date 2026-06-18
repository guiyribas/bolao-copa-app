import { apiFetch } from '@/lib/api';
import type { GlobalRankingResponse } from '@/types';

const GLOBAL_RANKING_REVALIDATE_SECONDS = 300;

export async function fetchGlobalRanking(
  page = 1,
  pageSize = 50
): Promise<GlobalRankingResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiFetch<GlobalRankingResponse>(`/api/global-ranking?${params.toString()}`, {
    next: { revalidate: GLOBAL_RANKING_REVALIDATE_SECONDS },
  });
}

export { GLOBAL_RANKING_REVALIDATE_SECONDS };
