import { redirect } from 'next/navigation';

export default async function PoolIndexPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await params;
  redirect(`/pool/${poolId}/ranking`);
}
