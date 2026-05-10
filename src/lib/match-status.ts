import type { Bet, Match, Team, User } from '@/types';

/** Strapi 4-style `attributes`, ou documento já “flat” (Strapi 5). */
function flattenStrapiEntry(raw: Record<string, unknown>): Record<string, unknown> {
  const attrs = raw.attributes;
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    const a = attrs as Record<string, unknown>;
    return {
      ...a,
      documentId: raw.documentId ?? a.documentId,
      id: raw.id ?? a.id,
    };
  }
  return { ...raw };
}

/**
 * Estado do jogo na API pode vir em `matchStatus` / `gameStatus` para não colidir
 * com `status` de publicação do Strapi (`draft` / `published`).
 */
function pickMatchGameStatus(raw: Record<string, unknown>): unknown {
  const explicit = [
    raw.matchStatus,
    raw.match_status,
    raw.gameStatus,
    raw.game_status,
    raw.match_state,
    raw.matchState,
  ];
  for (const v of explicit) {
    if (v !== undefined && v !== null && v !== '') return v;
  }

  const st = raw.status;
  if (st !== undefined && st !== null && st !== '') {
    if (st === 'draft' || st === 'published') return undefined;
    return st;
  }
  return undefined;
}

/** Aceita casing alternativo e alguns sinônimos comuns de APIs / CMS. */
export function normalizeMatchStatus(raw: unknown): Match['status'] {
  if (raw == null) return 'scheduled';

  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    if ('value' in o && o.value != null) {
      return normalizeMatchStatus(o.value);
    }
  }

  let s =
    typeof raw === 'string'
      ? raw.trim().toLowerCase()
      : String(raw).trim().toLowerCase();
  s = s.normalize('NFD').replace(/\p{M}/gu, '');
  s = s.replace(/\s+/g, '_').replace(/-/g, '_');

  if (
    s === 'live' ||
    s === 'in_progress' ||
    s === 'inprogress' ||
    s === 'playing' ||
    s === 'ongoing' ||
    s === 'started' ||
    s === 'ao_vivo' ||
    s === 'aovivo' ||
    s === 'em_andamento' ||
    s === 'emandamento'
  ) {
    return 'live';
  }
  if (
    s === 'finished' ||
    s === 'completed' ||
    s === 'final' ||
    s === 'ended' ||
    s === 'full_time' ||
    s === 'fulltime' ||
    s === 'ft'
  ) {
    return 'finished';
  }
  if (
    s === 'scheduled' ||
    s === 'not_started' ||
    s === 'notstarted' ||
    s === 'pending' ||
    s === 'upcoming' ||
    s === 'ns'
  ) {
    return 'scheduled';
  }

  return 'scheduled';
}

/** Times em relations podem vir com `attributes`; precisamos flatten para `flag` aparecer no nível esperado por `resolveTeamFlagUrl`. */
function normalizeNestedTeam(raw: unknown): Team | undefined {
  if (raw == null || typeof raw !== 'object') return undefined;
  const flat = flattenStrapiEntry(raw as Record<string, unknown>);
  if (typeof flat.documentId !== 'string') return undefined;
  return {
    documentId: flat.documentId,
    name: typeof flat.name === 'string' ? flat.name : '',
    code: typeof flat.code === 'string' ? flat.code : '',
    group: typeof flat.group === 'string' ? flat.group : '',
    flag: flat.flag as Team['flag'],
  };
}

/** Garante `Match.status` coerente com o que o backend enviou. */
export function normalizeMatchRecord(raw: unknown): Match | null {
  if (!raw || typeof raw !== 'object') return null;
  const flat = flattenStrapiEntry(raw as Record<string, unknown>);
  if (typeof flat.documentId !== 'string') return null;

  const status = normalizeMatchStatus(pickMatchGameStatus(flat));
  const homeTeam = normalizeNestedTeam(flat.homeTeam);
  const awayTeam = normalizeNestedTeam(flat.awayTeam);

  return {
    ...(flat as unknown as Match),
    status,
    homeTeam: homeTeam ?? (flat.homeTeam as Match['homeTeam']),
    awayTeam: awayTeam ?? (flat.awayTeam as Match['awayTeam']),
  };
}

export function normalizeMatchesPayload(payload: unknown): Match[] {
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: unknown[] }).data
      .map(normalizeMatchRecord)
      .filter((m): m is Match => m != null);
  }
  return [];
}

function normalizeBetRecord(raw: unknown): Bet | null {
  if (!raw || typeof raw !== 'object') return null;
  const flat = flattenStrapiEntry(raw as Record<string, unknown>);
  const match = normalizeMatchRecord(flat.match);
  if (!match || typeof flat.documentId !== 'string') return null;

  const userRaw = flat.user;
  let user: User = { id: 0, username: '', email: '' };
  if (userRaw && typeof userRaw === 'object') {
    const u = flattenStrapiEntry(userRaw as Record<string, unknown>);
    user = {
      id: typeof u.id === 'number' ? u.id : Number(u.id) || 0,
      documentId: typeof u.documentId === 'string' ? u.documentId : undefined,
      username: typeof u.username === 'string' ? u.username : '',
      email: typeof u.email === 'string' ? u.email : '',
    };
  }

  const hs = flat.homeScore;
  const aws = flat.awayScore;
  const pts = flat.points;

  return {
    documentId: flat.documentId,
    user,
    match,
    homeScore: typeof hs === 'number' ? hs : Number(hs) || 0,
    awayScore: typeof aws === 'number' ? aws : Number(aws) || 0,
    points: pts == null || pts === '' ? null : Number(pts),
  };
}

/** Payload `{ data: Bet[] }` ou lista direta de apostas Strapi. */
export function normalizeBetsPayload(payload: unknown): Bet[] {
  if (!payload) return [];
  const arr =
    typeof payload === 'object' &&
    payload !== null &&
    Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : Array.isArray(payload)
        ? payload
        : null;
  if (!arr) return [];
  return arr.map(normalizeBetRecord).filter((b): b is Bet => b != null);
}
