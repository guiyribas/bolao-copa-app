import { apiFetch, API_URL } from './api';
import type { User } from '@/types';

export const OAUTH_RETURN_URL_STORAGE_KEY = 'bolao-oauth-return-url';

export const GOOGLE_ONLY_LOGIN_MESSAGE =
  'This account uses Google Sign-In. Please use the Google button to log in.';

interface AuthResponse {
  jwt: string;
  user: User;
}

export async function login(
  identifier: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/local', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/local/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export async function forgotPassword(
  email: string
): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  code: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ code, password, passwordConfirmation }),
  });
}

export function getGoogleConnectUrl(): string {
  return `${API_URL}/api/connect/google`;
}

export async function loginWithProvider(
  provider: string,
  query: string
): Promise<AuthResponse> {
  const suffix = query.startsWith('?') ? query : `?${query}`;
  return apiFetch<AuthResponse>(`/api/auth/${provider}/callback${suffix}`);
}

export async function getMe(token: string): Promise<User> {
  const body = await apiFetch<unknown>('/api/users/me', {}, token);
  if (body && typeof body === 'object') {
    const o = body as Record<string, unknown>;
    const inner = o.data;
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      return inner as User;
    }
  }
  return body as User;
}
