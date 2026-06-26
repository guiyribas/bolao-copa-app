export interface User {
  id: number;
  /** Strapi 5 — usado em relations e URLs quando `id` numérico não bate com o populate. */
  documentId?: string;
  username: string;
  email: string;
}

export interface Team {
  documentId: string;
  name: string;
  code: string;
  group: string;
  /** Upload Strapi (`url` no nível root ou dentro de `data`, conforme o populate). */
  flag?: { url?: string } | null;
}

export interface Pool {
  /** ID numérico do Strapi (quando disponível no payload). */
  id?: number;
  documentId: string;
  name: string;
  description?: string;
  /** Valor por participante (taxa do bolão). */
  value: number;
  inviteCode: string;
  /** URL completa retornada pela API na criação (FRONTEND_URL/invite/CODE). */
  inviteLink?: string | null;
  admin?: User;
  /**
   * Quando vindo de `GET /api/pools/:id/session` — calculado no servidor (fiável).
   */
  isAdmin?: boolean;
  /** Total de membros (vindo de `/session`). */
  memberCount?: number;
  /** Total de membros que já pagaram (vindo de `/session`). */
  paidCount?: number;
  /** Soma arrecadada = `paidCount * value` (vindo de `/session`). */
  totalCollected?: number;
  /** Data de entrada do usuário autenticado (vindo de `/session` ou memberships). */
  viewerJoinedAt?: string;
}

export interface PoolMembership {
  documentId: string;
  pool: Pool;
  user: User;
  hasPaid: boolean;
  joinedAt: string;
  /** Posição no ranking do bolão (1 = primeiro). Só preenchido em `/api/pools/mine/memberships`. */
  rankingPlace?: number | null;
  /** Total de participantes no ranking desse bolão. */
  rankingTotal?: number;
}

export interface Match {
  documentId: string;
  /** Título da partida no Strapi (ex.: seed da Copa). */
  title?: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  venue: string;
  homeScore: number | null;
  awayScore: number | null;
  phase: string;
  group?: string;
  status: 'scheduled' | 'live' | 'finished';
  matchNumber: number;
}

export interface Bet {
  documentId: string;
  user: User;
  match: Match;
  homeScore: number;
  awayScore: number;
  points: number | null;
}

export interface RankingEntry {
  userId: string;
  username: string;
  /** Total de pontos no bolão. */
  points: number;
  /** Pontos só na fase de grupos, quando a API enviar o breakdown. */
  pointsGroupPhase?: number | null;
  /** Pontos só no mata-mata, quando a API enviar o breakdown. */
  pointsKnockout?: number | null;
}

export interface GlobalRankingMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface GlobalRankingResponse {
  data: RankingEntry[];
  meta: GlobalRankingMeta;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamCode: string;
  /** Da API de mídia do time, quando existir; senão a UI usa CDN pelo `teamCode`. */
  flagUrl?: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface MemberEntry {
  id: number;
  /** Document ID do usuário (Strapi 5); usar no PATCH de pagamento. */
  userDocumentId: string;
  username: string;
  email: string;
  hasPaid: boolean;
  joinedAt: string;
  membershipId: string;
}

/** Resposta de `GET /api/pools/match/:matchDocumentId/bets`. */
export interface PoolMatchBetRow {
  userId: string;
  username: string;
  homeScore: number | null;
  awayScore: number | null;
  points: number | null;
  hasBet: boolean;
  isViewer: boolean;
}

export interface PoolMatchSection {
  poolDocumentId: string;
  poolName: string;
  entries: PoolMatchBetRow[];
}

export interface PoolMatchBetsPayload {
  matchDocumentId: string;
  matchStatus: string;
  revealed: boolean;
  pools: PoolMatchSection[];
}
