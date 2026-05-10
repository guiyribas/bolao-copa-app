import type { Pool, User } from '@/types';

function pickStr(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && String(v).trim() !== '') return String(v);
  }
  return undefined;
}

/**
 * Desembrulha admin/user vindos do Strapi (flat, `data`, `attributes`).
 */
function normalizeUserLike(raw: unknown): User | undefined {
  if (raw == null || typeof raw !== 'object') return undefined;
  let o = raw as Record<string, unknown>;

  if (o.data != null && typeof o.data === 'object' && !Array.isArray(o.data)) {
    o = o.data as Record<string, unknown>;
  }

  const attrs = o.attributes;
  const src =
    attrs && typeof attrs === 'object' && !Array.isArray(attrs)
      ? (attrs as Record<string, unknown>)
      : o;

  const idRaw = src.id ?? o.id;
  const id =
    typeof idRaw === 'number'
      ? idRaw
      : typeof idRaw === 'string'
        ? Number(idRaw) || 0
        : 0;

  const documentId =
    pickStr(src, ['documentId', 'document_id']) ??
    pickStr(o, ['documentId', 'document_id']);

  const username = pickStr(src, ['username']) ?? '';
  const email = pickStr(src, ['email']) ?? '';

  if (!username && !email) return undefined;

  return {
    id,
    documentId,
    username: username || email || '?',
    email,
  };
}

/**
 * Normaliza resposta de um bolão (controller custom ou Strapi REST).
 */
export function normalizePoolFromApi(body: unknown): Pool | null {
  if (body == null || typeof body !== 'object') return null;
  const root = body as Record<string, unknown>;

  let poolObj: Record<string, unknown> | null = null;
  if (root.data != null && typeof root.data === 'object' && !Array.isArray(root.data)) {
    poolObj = root.data as Record<string, unknown>;
  } else {
    poolObj = root;
  }

  let flat: Record<string, unknown> = poolObj;
  if (poolObj.attributes && typeof poolObj.attributes === 'object') {
    const attr = poolObj.attributes as Record<string, unknown>;
    flat = {
      ...attr,
      id: poolObj.id,
      documentId:
        pickStr(poolObj, ['documentId', 'document_id']) ??
        pickStr(attr, ['documentId', 'document_id']),
    };
  }

  const documentId = pickStr(flat, ['documentId', 'document_id']);
  const name = pickStr(flat, ['name']);
  if (!documentId || !name) return null;

  const admin = normalizeUserLike(flat.admin);

  return {
    documentId,
    name,
    description: pickStr(flat, ['description']),
    inviteCode: pickStr(flat, ['inviteCode', 'invite_code']) ?? '',
    inviteLink: pickStr(flat, ['inviteLink', 'invite_link']) ?? null,
    admin,
  };
}
