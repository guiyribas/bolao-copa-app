export const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const MOCK_CREDENTIALS = {
  identifier: 'mock@local.dev',
  password: 'mock123',
} as const;

export const MOCK_JWT = 'mock-jwt-dev';
