import type { Metadata } from 'next';
import { fetchPoolByDocumentId } from '@/lib/pools';
import { pageMetadata } from '@/lib/site-metadata';

type RankingLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ poolId: string }>;
};

export async function generateMetadata({
  params,
}: Pick<RankingLayoutProps, 'params'>): Promise<Metadata> {
  const { poolId } = await params;
  const pool = await fetchPoolByDocumentId(poolId);
  const poolName = pool?.name?.trim() || 'Bolão';
  return pageMetadata(`Ranking · ${poolName}`);
}

export default function PoolRankingLayout({ children }: RankingLayoutProps) {
  return children;
}
