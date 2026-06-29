import type { ApiFetchOptions } from '@/lib/api';
import { handleMockRequest } from '@/mocks/handlers';

function parseRequestBody(body: RequestInit['body']): unknown {
  if (body == null) return undefined;
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  return body;
}

export async function mockApiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  token?: string | null
): Promise<T> {
  const result = handleMockRequest({
    method: options.method ?? 'GET',
    path,
    body: parseRequestBody(options.body),
    token,
  });

  return result as T;
}
