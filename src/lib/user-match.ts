import type { User } from '@/types';

/**
 * Strapi 5 usa `documentId` para relations; o utilizador logado pode ter só `id`
 * numérico vindo do JWT/login. Compara os identificadores que a API expuser.
 */
export function isSameUser(
  a: User | null | undefined,
  b: User | null | undefined
): boolean {
  if (!a || !b) return false;

  const docA = a.documentId?.trim();
  const docB = b.documentId?.trim();
  if (docA && docB && docA === docB) return true;

  const idA = a.id;
  const idB = b.id;
  if (idA != null && idB != null && Number(idA) === Number(idB)) return true;

  const emailA = a.email?.trim().toLowerCase();
  const emailB = b.email?.trim().toLowerCase();
  if (emailA && emailB && emailA === emailB) return true;

  const ua = a.username?.trim().toLowerCase();
  const ub = b.username?.trim().toLowerCase();
  if (ua && ub && ua === ub) return true;

  return false;
}
