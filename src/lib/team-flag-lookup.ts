import type { Bet, Match, Team } from '@/types';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';

/** Mapa team.documentId → URL absoluta da bandeira (como em Palpites). */
export function buildTeamFlagLookup(matches: Match[]): Map<string, string | null> {
  const map = new Map<string, string | null>();
  for (const m of matches) {
    for (const t of [m.homeTeam, m.awayTeam]) {
      if (t?.documentId && !map.has(t.documentId)) {
        map.set(t.documentId, resolveTeamFlagUrl(t));
      }
    }
  }
  return map;
}

function enrichTeamFromLookup(
  t: Team | undefined,
  lookup: Map<string, string | null>
): Team | undefined {
  if (!t?.documentId) return t;
  if (resolveTeamFlagUrl(t)) return t;
  const url = lookup.get(t.documentId);
  if (url == null || url === '') return t;
  return { ...t, flag: { url } };
}

export function enrichMatchTeamFlags(match: Match, lookup: Map<string, string | null>): Match {
  if (lookup.size === 0) return match;
  return {
    ...match,
    homeTeam: enrichTeamFromLookup(match.homeTeam, lookup) ?? match.homeTeam,
    awayTeam: enrichTeamFromLookup(match.awayTeam, lookup) ?? match.awayTeam,
  };
}

export function enrichBetsWithTeamFlagLookup(
  bets: Bet[],
  lookup: Map<string, string | null>
): Bet[] {
  if (lookup.size === 0) return bets;
  return bets.map((b) => ({
    ...b,
    match: enrichMatchTeamFlags(b.match, lookup),
  }));
}
