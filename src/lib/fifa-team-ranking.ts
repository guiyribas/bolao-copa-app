import type { Team } from '@/types';

/** Ranking FIFA masculino por código da seleção (3 letras). Atualizar manualmente. */
const FIFA_RANK_BY_TEAM_CODE: Record<string, number> = {
  ARG: 1,
  FRA: 2,
  BRA: 3,
  ENG: 4,
  BEL: 5,
  CRO: 6,
  NED: 7,
  POR: 8,
  ITA: 9,
  ESP: 10,
  MAR: 11,
  SUI: 12,
  USA: 13,
  GER: 14,
  MEX: 15,
  URU: 16,
  COL: 17,
  DEN: 18,
  JPN: 19,
  SEN: 20,
  IRN: 21,
  PER: 22,
  POL: 23,
  KSA: 24,
  AUS: 25,
  TUN: 26,
  EGY: 27,
  ECU: 28,
  UKR: 29,
  CHI: 30,
  AUT: 31,
  ALG: 32,
  SVN: 33,
  ROU: 34,
  QAT: 35,
  IRQ: 36,
  CIV: 37,
  GHA: 38,
  PAN: 39,
  UZB: 40,
  JOR: 41,
  NZL: 42,
  HAI: 43,
  SCO: 44,
  BOL: 45,
  CPV: 46,
  CAN: 47,
  CRC: 48,
  PAR: 49,
  WAL: 50,
};

export function getFifaRankingForTeam(team: Pick<Team, 'code'> | null | undefined): number | null {
  const code = team?.code?.trim().toUpperCase();
  if (!code) return null;
  const rank = FIFA_RANK_BY_TEAM_CODE[code];
  return rank != null ? rank : null;
}
