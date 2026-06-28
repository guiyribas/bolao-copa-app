import { ApiError } from '@/lib/api';
import type { Match, Pool } from '@/types';
import { MOCK_CREDENTIALS, MOCK_JWT } from '@/mocks/config';
import { getActivePersona } from '@/mocks/personas';
import type { MockPersona } from '@/mocks/types';

export interface MockRequestContext {
  method: string;
  path: string;
  body?: unknown;
  token?: string | null;
}

function parsePath(path: string): { pathname: string; searchParams: URLSearchParams } {
  const qIndex = path.indexOf('?');
  const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
  const query = qIndex >= 0 ? path.slice(qIndex + 1) : '';
  return { pathname, searchParams: new URLSearchParams(query) };
}

/** Reject stale real JWTs so they never silently fall through to Strapi. */
function assertMockToken(token: string | null | undefined, required: boolean): void {
  if (token && token !== MOCK_JWT) {
    throw new ApiError('Invalid token', 401);
  }
  if (required && token !== MOCK_JWT) {
    throw new ApiError('Unauthorized', 401);
  }
}

function findPoolByDocumentId(persona: MockPersona, documentId: string): Pool | undefined {
  const session = persona.poolSessions[documentId];
  if (session) return session;

  for (const membership of persona.memberships) {
    if (membership.pool.documentId === documentId) return membership.pool;
  }

  return undefined;
}

function findPoolByInviteCode(persona: MockPersona, inviteCode: string): Pool | undefined {
  for (const membership of persona.memberships) {
    if (membership.pool.inviteCode === inviteCode) return membership.pool;
  }

  for (const pool of Object.values(persona.poolSessions)) {
    if (pool.inviteCode === inviteCode) return pool;
  }

  return undefined;
}

function filterMatches(matches: Match[], searchParams: URLSearchParams): Match[] {
  let result = matches;

  const phase = searchParams.get('filters[phase][$eq]');
  if (phase) {
    result = result.filter((m) => m.phase === phase);
  }

  const documentId = searchParams.get('filters[documentId][$eq]');
  if (documentId) {
    result = result.filter((m) => m.documentId === documentId);
  }

  return result;
}

function handleAuthLocal(body: unknown, persona: MockPersona): unknown {
  if (!body || typeof body !== 'object') {
    throw new ApiError('Invalid identifier or password', 400);
  }

  const { identifier, password } = body as Record<string, unknown>;
  if (
    identifier !== MOCK_CREDENTIALS.identifier ||
    password !== MOCK_CREDENTIALS.password
  ) {
    throw new ApiError('Invalid identifier or password', 400);
  }

  return { jwt: MOCK_JWT, user: persona.user };
}

function handlePoolsList(searchParams: URLSearchParams, persona: MockPersona): unknown {
  const documentId = searchParams.get('filters[documentId][$eq]');
  if (documentId) {
    const pool = findPoolByDocumentId(persona, documentId);
    return { data: pool ? [pool] : [] };
  }

  const inviteCode = searchParams.get('filters[inviteCode][$eq]');
  if (inviteCode) {
    const pool = findPoolByInviteCode(persona, inviteCode);
    return { data: pool ? [pool] : [] };
  }

  return { data: [] };
}

function handlePoolSession(poolId: string, persona: MockPersona): unknown {
  const session = persona.poolSessions[poolId];
  if (!session) {
    throw new ApiError('Pool session not found', 404);
  }
  return session;
}

function handleMatches(searchParams: URLSearchParams, persona: MockPersona): unknown {
  return { data: filterMatches(persona.matches, searchParams) };
}

function handleRanking(persona: MockPersona): unknown {
  const { user } = persona;
  return {
    data: [
      {
        userId: user.documentId ?? String(user.id),
        username: user.username,
        points: 42,
        pointsGroupPhase: 30,
        pointsKnockout: 12,
      },
    ],
  };
}

function notImplemented(method: string, pathname: string): never {
  throw new ApiError(`Mock handler not implemented: ${method} ${pathname}`, 501);
}

export function handleMockRequest(ctx: MockRequestContext): unknown {
  const method = ctx.method.toUpperCase();
  const { pathname, searchParams } = parsePath(ctx.path);
  const persona = getActivePersona();

  assertMockToken(ctx.token, false);

  if (method === 'POST' && pathname === '/api/auth/local') {
    return handleAuthLocal(ctx.body, persona);
  }

  if (method === 'GET' && pathname === '/api/users/me') {
    assertMockToken(ctx.token, true);
    return persona.user;
  }

  if (method === 'GET' && pathname === '/api/pools/mine/memberships') {
    assertMockToken(ctx.token, true);
    return { data: persona.memberships };
  }

  if (method === 'GET' && pathname === '/api/pools') {
    return handlePoolsList(searchParams, persona);
  }

  const poolSessionMatch = pathname.match(/^\/api\/pools\/([^/]+)\/session$/);
  if (method === 'GET' && poolSessionMatch) {
    assertMockToken(ctx.token, true);
    return handlePoolSession(poolSessionMatch[1], persona);
  }

  const poolRankingMatch = pathname.match(/^\/api\/pools\/([^/]+)\/ranking$/);
  if (method === 'GET' && poolRankingMatch) {
    assertMockToken(ctx.token, true);
    return handleRanking(persona);
  }

  if (method === 'GET' && pathname === '/api/matches') {
    return handleMatches(searchParams, persona);
  }

  if (method === 'GET' && pathname === '/api/bets/my-bets') {
    assertMockToken(ctx.token, true);
    return { data: [] };
  }

  notImplemented(method, pathname);
}
