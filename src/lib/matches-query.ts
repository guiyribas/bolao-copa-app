/** Uma partida pelo `documentId` (Strapi 5). */
export function matchByDocumentIdPath(documentId: string): string {
  const params = new URLSearchParams();
  params.set('filters[documentId][$eq]', documentId);
  params.set('populate[homeTeam][populate][0]', 'flag');
  params.set('populate[awayTeam][populate][0]', 'flag');
  params.set('pagination[pageSize]', '1');
  return `/api/matches?${params.toString()}`;
}

/** Strapi 5 REST: use bracket notation (not comma lists) for populate, sort and filters. */
export function matchesListPath(phase: string | null | undefined): string {
  const params = new URLSearchParams();
  params.set('populate[homeTeam][populate][0]', 'flag');
  params.set('populate[awayTeam][populate][0]', 'flag');
  params.set('sort[0]', 'date:asc');
  params.set('pagination[pageSize]', '500');
  if (phase) {
    params.set('filters[phase][$eq]', phase);
  }
  return `/api/matches?${params.toString()}`;
}
