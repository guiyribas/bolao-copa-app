import type { Team } from '@/types';
import { resolvePublicApiBaseUrl } from './api';

/** Base pública (same-origin em produção): `/uploads/...` → URL absoluta. */
export function apiBaseUrl(): string {
  return resolvePublicApiBaseUrl();
}

export function absoluteStrapiMediaUrl(pathOrUrl: string): string {
  const u = pathOrUrl.trim();
  if (!u) return u;
  if (u.startsWith('//')) return `https:${u}`;
  if (/^https?:\/\//i.test(u)) return u;
  const base = apiBaseUrl();
  return u.startsWith('/') ? `${base}${u}` : `${base}/${u}`;
}

/**
 * Obtém URL de um campo Upload/relation Strapi (`url` direto ou em `data` / `attributes`).
 */
export function extractStrapiMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null;

  const o = media as Record<string, unknown>;
  if (typeof o.url === 'string' && o.url.trim()) return o.url.trim();

  const inner = o.data;

  // multi-upload: pegar primeira
  if (Array.isArray(inner) && inner.length > 0) {
    return extractStrapiMediaUrl(inner[0]);
  }

  if (!inner || typeof inner !== 'object') return null;

  const d = inner as Record<string, unknown>;
  if (typeof d.url === 'string' && d.url.trim()) return d.url.trim();

  const attrs = d.attributes;
  if (!attrs || typeof attrs !== 'object') return null;
  const u = (attrs as Record<string, unknown>).url;
  if (typeof u === 'string' && u.trim()) return u.trim();

  return null;
}

/** URL absoluta da bandeira do país vinda do backend (nada de CDN externo). */
export function resolveTeamFlagUrl(team: Pick<Team, 'flag'>): string | null {
  const raw = extractStrapiMediaUrl(team.flag);
  return raw ? absoluteStrapiMediaUrl(raw) : null;
}
