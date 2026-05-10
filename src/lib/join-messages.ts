import { ApiError } from './api';

const GENERIC = 'Não foi possível entrar no bolão. Tente novamente.';

/** Mensagens amigáveis para erros de convite / entrada no bolão. */
export function messageForJoinError(err: unknown): string {
  if (err instanceof ApiError) {
    return messageForJoinStatus(err.status, err.message);
  }
  if (err instanceof Error) return err.message || GENERIC;
  return GENERIC;
}

export function messageForJoinStatus(
  status: number,
  serverMessage?: string
): string {
  const m = (serverMessage || '').toLowerCase();

  if (status === 401) {
    return 'Faça login para entrar neste bolão.';
  }
  if (status === 403) {
    return 'Você não tem permissão para entrar neste bolão.';
  }
  if (status === 404) {
    return 'Convite inválido ou bolão não encontrado.';
  }
  if (status === 400) {
    if (
      m.includes('member') ||
      m.includes('already') ||
      m.includes('membro') ||
      m.includes('já')
    ) {
      return 'Você já participa deste bolão.';
    }
    return serverMessage || 'Não foi possível concluir o convite.';
  }
  if (status >= 500) {
    return 'Serviço temporariamente indisponível. Tente mais tarde.';
  }
  return serverMessage || GENERIC;
}

export function isAlreadyMemberError(err: unknown): boolean {
  if (!(err instanceof ApiError) || err.status !== 400) return false;
  const m = err.message.toLowerCase();
  return (
    m.includes('member') ||
    m.includes('already') ||
    m.includes('membro') ||
    m.includes('já')
  );
}
