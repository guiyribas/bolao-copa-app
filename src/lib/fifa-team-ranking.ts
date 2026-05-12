import type { Team } from '@/types';

/** Ranking FIFA masculino (abril/2026) por código da seleção (3 letras). Atualizar manualmente. */
const FIFA_RANK_BY_TEAM_CODE: Record<string, number> = {
  FRA: 1,
  ESP: 2,
  ARG: 3,
  ENG: 4,
  POR: 5,
  BRA: 6,
  NED: 7,
  MAR: 8,
  BEL: 9,
  GER: 10,
  CRO: 11,
  COL: 13,
  SEN: 14,
  MEX: 15,
  USA: 16,
  URU: 17,
  JPN: 18,
  SUI: 19,
  IRN: 21,
  TUR: 22,
  ECU: 23,
  AUT: 24,
  KOR: 25,
  AUS: 27,
  ALG: 28,
  EGY: 29,
  CAN: 30,
  NOR: 31,
  PAN: 33,
  CIV: 34,
  SWE: 38,
  PAR: 40,
  CZE: 41,
  SCO: 43,
  TUN: 44,
  COD: 46,
  UZB: 50,
  QAT: 55,
  IRQ: 57,
  RSA: 60,
  KSA: 61,
  JOR: 63,
  BIH: 65,
  CPV: 68,
  GHA: 74,
  CUW: 82,
  HAI: 84,
  NZL: 85,
};

export function getFifaRankingForTeam(
  team: Pick<Team, 'code'> | null | undefined
): number | null {
  const code = team?.code?.trim().toUpperCase();
  if (!code) return null;
  const rank = FIFA_RANK_BY_TEAM_CODE[code];
  return rank != null ? rank : null;
}
