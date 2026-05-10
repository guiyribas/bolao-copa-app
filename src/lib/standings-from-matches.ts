import type { Match, Team, TeamStanding } from '@/types';
import { GROUP_PHASE } from '@/lib/match-phases';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';

type Row = TeamStanding;

function getGroupKey(m: Match): string | null {
  const g = m.group ?? m.homeTeam?.group;
  if (g == null || String(g).trim() === '') return null;
  return String(g).trim();
}

export function standingsFromGroupMatches(matches: Match[]): Record<string, TeamStanding[]> {
  const byGroup = new Map<string, Map<string, Row>>();

  const ensureTeam = (groupKey: string, team: Team) => {
    if (!team?.documentId) return;
    let gmap = byGroup.get(groupKey);
    if (!gmap) {
      gmap = new Map();
      byGroup.set(groupKey, gmap);
    }
    if (!gmap.has(team.documentId)) {
      gmap.set(team.documentId, {
        teamId: team.documentId,
        teamName: team.name ?? team.code,
        teamCode: team.code,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        flagUrl: resolveTeamFlagUrl(team) ?? undefined,
      });
    }
  };

  for (const m of matches) {
    if (m.phase !== GROUP_PHASE) continue;
    const g = getGroupKey(m);
    if (!g) continue;
    const ht = m.homeTeam;
    const at = m.awayTeam;
    if (!ht?.documentId || !at?.documentId) continue;
    ensureTeam(g, ht);
    ensureTeam(g, at);
  }

  for (const m of matches) {
    if (m.phase !== GROUP_PHASE) continue;
    const g = getGroupKey(m);
    if (!g) continue;
    const hs = m.homeScore;
    const as = m.awayScore;
    if (hs == null || as == null) continue;
    const gmap = byGroup.get(g);
    if (!gmap) continue;
    const home = gmap.get(m.homeTeam.documentId);
    const away = gmap.get(m.awayTeam.documentId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += hs;
    home.goalsAgainst += as;
    away.goalsFor += as;
    away.goalsAgainst += hs;

    if (hs > as) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (hs < as) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  }

  const out: Record<string, TeamStanding[]> = {};
  for (const [g, gmap] of byGroup) {
    const rows = Array.from(gmap.values()).map((r) => ({
      ...r,
      goalDifference: r.goalsFor - r.goalsAgainst,
    }));
    rows.sort(compareStandings);
    out[g] = rows;
  }
  return out;
}

function compareStandings(a: TeamStanding, b: TeamStanding): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.teamCode.localeCompare(b.teamCode);
}
