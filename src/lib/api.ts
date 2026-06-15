const DEFAULT_API_URL = 'http://localhost:1337';

function normalizeApiBaseUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) return DEFAULT_API_URL;
  return trimmed.replace(/\/$/, '');
}

/** Base pública (browser / same-origin em produção). */
export function resolvePublicApiBaseUrl(): string {
  return normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}

/** Base para fetch: Strapi direto no servidor; origem pública no client. */
export function resolveApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    const strapiUrl = process.env.STRAPI_API_URL?.trim();
    if (strapiUrl) return strapiUrl.replace(/\/$/, '');
  }
  return resolvePublicApiBaseUrl();
}

export const API_URL = resolvePublicApiBaseUrl();

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extractErrorMessage(body: unknown, fallbackStatus: number): string {
  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    const err = o.error;
    if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      if (typeof e.message === 'string') return e.message;
    }
    if (typeof o.message === 'string') return o.message;
  }
  return `Request failed: ${fallbackStatus}`;
}

export type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let body: unknown = {};
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(body, res.status), res.status, body);
  }

  return body as T;
}
