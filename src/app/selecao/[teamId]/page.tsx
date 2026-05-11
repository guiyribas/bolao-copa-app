import type { Metadata } from 'next';
import { fetchTeamByDocumentId, teamPageTitle } from '@/lib/team-metadata';
import { pageMetadata } from '@/lib/site-metadata';
import SelecaoPage from './selecao-page';

type SelecaoPageProps = {
  params: Promise<{ teamId: string }>;
};

export async function generateMetadata({
  params,
}: Pick<SelecaoPageProps, 'params'>): Promise<Metadata> {
  const { teamId } = await params;

  try {
    const team = await fetchTeamByDocumentId(teamId);
    return pageMetadata(teamPageTitle(team));
  } catch {
    return pageMetadata('Seleção');
  }
}

export default function Page() {
  return <SelecaoPage />;
}
