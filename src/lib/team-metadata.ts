import { apiFetch } from '@/lib/api';
import { matchesListPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import { findTeamInMatches } from '@/lib/team-matches';
import type { Team } from '@/types';

export async function fetchTeamByDocumentId(
  documentId: string
): Promise<Team | null> {
  const res = await apiFetch<unknown>(matchesListPath(undefined), {
    next: { revalidate: 120 },
  });
  const matches = normalizeMatchesPayload(res);
  return findTeamInMatches(matches, documentId);
}

export function teamPageTitle(team: Team | null): string {
  if (!team) return 'Seleção';
  const name = team.name?.trim();
  if (name) return `${name} · Seleção`;
  return 'Seleção';
}
