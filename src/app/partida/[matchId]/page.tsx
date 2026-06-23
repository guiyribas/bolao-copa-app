import type { Metadata } from 'next';
import { fetchMatchByDocumentId, matchPageTitle } from '@/lib/match-metadata';
import { pageMetadata } from '@/lib/site-metadata';
import type { Match } from '@/types';
import PartidaPage from './partida-page';

export const revalidate = 120;

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

export default async function Page({ params }: PartidaPageProps) {
  const { matchId } = await params;
  let initialMatch: Match | null = null;
  try {
    initialMatch = await fetchMatchByDocumentId(matchId);
  } catch {
    initialMatch = null;
  }
  return <PartidaPage initialMatch={initialMatch} />;
}
