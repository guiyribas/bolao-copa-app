import type { Metadata } from 'next';
import { fetchPoolByDocumentId } from '@/lib/pools';
import { pageMetadata } from '@/lib/site-metadata';

type AdminLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ poolId: string }>;
};

export async function generateMetadata({
  params,
}: Pick<AdminLayoutProps, 'params'>): Promise<Metadata> {
  const { poolId } = await params;
  const pool = await fetchPoolByDocumentId(poolId);
  const poolName = pool?.name?.trim() || 'Bolão';
  return pageMetadata(`Admin · ${poolName}`);
}

export default function PoolAdminLayout({ children }: AdminLayoutProps) {
  return children;
}
