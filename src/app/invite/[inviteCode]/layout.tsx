import type { Metadata } from 'next';
import { fetchPoolByInviteCode } from '@/lib/pools';
import { pageMetadata } from '@/lib/site-metadata';

type InviteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ inviteCode: string }>;
};

export async function generateMetadata({
  params,
}: Pick<InviteLayoutProps, 'params'>): Promise<Metadata> {
  const { inviteCode } = await params;
  const pool = await fetchPoolByInviteCode(inviteCode);
  const title = pool?.name?.trim() || 'Convite inválido';

  return pageMetadata(title, {
    openGraph: {
      title,
    },
  });
}

export default function InviteLayout({ children }: InviteLayoutProps) {
  return children;
}
