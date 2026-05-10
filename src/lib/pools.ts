import { apiFetch } from './api';
import type { Pool } from '@/types';

export async function fetchPoolByInviteCode(
  inviteCode: string
): Promise<Pool | null> {
  const res = await apiFetch<{ data: Pool[] }>(
    `/api/pools?filters[inviteCode][$eq]=${encodeURIComponent(inviteCode)}`
  );
  const first = res.data?.[0];
  return first ?? null;
}

export async function joinPoolByInviteCode(
  inviteCode: string,
  token: string
): Promise<unknown> {
  return apiFetch<unknown>(
    '/api/pools/join',
    {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    },
    token
  );
}

/** Best-effort: suporta vários formatos de resposta do Strapi / controller customizado. */
export function resolvePoolDocumentIdFromJoinResponse(
  body: unknown
): string | null {
  if (!body || typeof body !== 'object') return null;
  const root = body as Record<string, unknown>;
  const data = root.data;
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (typeof d.documentId === 'string') return d.documentId;
  const pool = d.pool;
  if (pool && typeof pool === 'object') {
    const pid = (pool as Record<string, unknown>).documentId;
    if (typeof pid === 'string') return pid;
  }
  const membership = d.membership ?? d.poolMembership;
  if (membership && typeof membership === 'object') {
    const m = membership as Record<string, unknown>;
    const nestedPool = m.pool;
    if (nestedPool && typeof nestedPool === 'object') {
      const nid = (nestedPool as Record<string, unknown>).documentId;
      if (typeof nid === 'string') return nid;
    }
  }
  return null;
}
