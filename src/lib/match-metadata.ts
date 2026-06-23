import { cache } from 'react';
import { apiFetch } from '@/lib/api';
import { matchByDocumentIdPath } from '@/lib/matches-query';
import { normalizeMatchesPayload } from '@/lib/match-status';
import type { Match } from '@/types';

export const fetchMatchByDocumentId = cache(async function fetchMatchByDocumentId(
  documentId: string
): Promise<Match | null> {
  const res = await apiFetch<unknown>(matchByDocumentIdPath(documentId), {
    next: { revalidate: 120 },
  });
  const matches = normalizeMatchesPayload(res);
  return matches[0] ?? null;
});

export function matchPageTitle(match: Match | null): string {
  if (!match) return 'Partida';
  const home = match.homeTeam?.name?.trim();
  const away = match.awayTeam?.name?.trim();
  if (home && away) return `${home} × ${away}`;
  return 'Partida';
}
