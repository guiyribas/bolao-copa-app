import { apiFetch } from '@/lib/api';

const CURRENT_PHASE_REVALIDATE_SECONDS = 60;

export async function fetchCurrentTournamentPhase(): Promise<string> {
  const res = await apiFetch<{ currentPhase: string }>('/api/tournament/current-phase', {
    next: { revalidate: CURRENT_PHASE_REVALIDATE_SECONDS },
  });
  return res.currentPhase;
}

export { CURRENT_PHASE_REVALIDATE_SECONDS };
