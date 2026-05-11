import {
  formatLocalDateLong,
  localCalendarDayKey,
} from '@/components/MatchCard/matchCard.utils';
import type { Match, Team } from '@/types';

export function findTeamInMatches(
  matches: Match[],
  teamDocumentId: string
): Team | null {
  const id = teamDocumentId.trim();
  if (!id) return null;
  for (const m of matches) {
    if (m.homeTeam?.documentId === id) return m.homeTeam;
    if (m.awayTeam?.documentId === id) return m.awayTeam;
  }
  return null;
}

export function matchesForTeam(matches: Match[], teamDocumentId: string): Match[] {
  const id = teamDocumentId.trim();
  if (!id) return [];
  return matches
    .filter(
      (m) => m.homeTeam?.documentId === id || m.awayTeam?.documentId === id
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export type MatchesByLocalDay = {
  dayKey: string;
  label: string;
  matches: Match[];
};

export function groupMatchesByLocalDay(matches: Match[]): MatchesByLocalDay[] {
  const groups: MatchesByLocalDay[] = [];
  for (const m of matches) {
    const dayKey = localCalendarDayKey(m.date);
    const last = groups[groups.length - 1];
    if (last?.dayKey === dayKey) {
      last.matches.push(m);
    } else {
      groups.push({
        dayKey,
        label: formatLocalDateLong(new Date(m.date)),
        matches: [m],
      });
    }
  }
  return groups;
}
