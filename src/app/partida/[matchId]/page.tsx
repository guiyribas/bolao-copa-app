import type { Metadata } from 'next';
import { fetchMatchByDocumentId, matchPageTitle } from '@/lib/match-metadata';
import { pageMetadata } from '@/lib/site-metadata';
import PartidaPage from './partida-page';

type PartidaPageProps = {
  params: Promise<{ matchId: string }>;
};

export async function generateMetadata({
  params,
}: Pick<PartidaPageProps, 'params'>): Promise<Metadata> {
  const { matchId } = await params;

  try {
    const match = await fetchMatchByDocumentId(matchId);
    return pageMetadata(matchPageTitle(match));
  } catch {
    return pageMetadata('Partida');
  }
}

export default function Page() {
  return <PartidaPage />;
}
