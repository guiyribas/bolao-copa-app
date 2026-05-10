import type { MemberEntry } from '@/types';

function pickStr(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && String(v).trim() !== '') return String(v);
  }
  return undefined;
}

/** Aceita lista direta ou envelopes comuns da API / Strapi. */
export function extractMembersFromResponse(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (!body || typeof body !== 'object') return [];
  const root = body as Record<string, unknown>;
  const data = root.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const inner = (data as Record<string, unknown>).data;
    if (Array.isArray(inner)) return inner;
  }
  return [];
}

/**
 * Normaliza membros do bolão (camelCase, snake_case, usuário aninhado).
 * Sem `userDocumentId` o PATCH de pagamento não pode ser chamado.
 */
export function normalizeMemberEntry(raw: unknown): MemberEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;

  const user =
    row.user && typeof row.user === 'object'
      ? (row.user as Record<string, unknown>)
      : null;

  const username =
    pickStr(row, ['username']) ?? pickStr(user ?? {}, ['username']);
  if (!username) return null;

  const email =
    pickStr(row, ['email']) ?? pickStr(user ?? {}, ['email']) ?? '';

  const userDocumentId =
    pickStr(row, ['userDocumentId', 'user_document_id']) ??
    pickStr(user ?? {}, ['documentId', 'document_id']) ??
    '';

  const idRaw = row.id ?? user?.id;
  const id =
    typeof idRaw === 'number'
      ? idRaw
      : typeof idRaw === 'string'
        ? Number(idRaw) || 0
        : 0;

  const membershipId =
    pickStr(row, ['membershipId', 'membership_id']) ??
    pickStr(row, ['documentId', 'document_id']) ??
    '';

  const hasPaid = Boolean(row.hasPaid ?? row.has_paid);

  const joinedAt =
    pickStr(row, ['joinedAt', 'joined_at', 'createdAt', 'created_at']) ?? '';

  return {
    id,
    userDocumentId,
    username,
    email,
    hasPaid,
    joinedAt: joinedAt || new Date().toISOString(),
    membershipId,
  };
}
