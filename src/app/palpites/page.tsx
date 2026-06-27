import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { isKnockoutPhase } from '@/lib/match-phases';
import { pageMetadata } from '@/lib/site-metadata';
import { fetchCurrentTournamentPhase } from '@/lib/tournament-phase';
import PalpitesPage from './palpites-page';

export const metadata = pageMetadata('Palpites');

type PageProps = {
  searchParams: Promise<{ phase?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { phase } = await searchParams;

  let currentPhase: string | null = null;
  if (!phase) {
    try {
      currentPhase = await fetchCurrentTournamentPhase();
    } catch {
      // Fallback: keep default Todas tab when API is unavailable.
    }
  }

  if (!phase && currentPhase && isKnockoutPhase(currentPhase)) {
    redirect(`/palpites?phase=${currentPhase}`);
  }

  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <PalpitesPage />
    </Suspense>
  );
}
