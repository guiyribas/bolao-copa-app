import { apiFetch } from './api';
import type { User } from '@/types';

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

export async function getMe(token: string): Promise<User> {
  return apiFetch<User>('/api/users/me', {}, token);
}
