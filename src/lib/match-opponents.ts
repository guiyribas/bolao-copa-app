import type { Match } from '@/types';

function teamSlotFilled(team: Match['homeTeam'] | null | undefined): boolean {
  if (team == null) return false;
  const id = team.documentId;
  return typeof id === 'string' && id.trim() !== '';
}

/** Casa e visitante já cadastrados no CMS (times reais no mata‑mata, etc.). */
export function areMatchOpponentsDefined(match: Match): boolean {
  return teamSlotFilled(match.homeTeam) && teamSlotFilled(match.awayTeam);
}
