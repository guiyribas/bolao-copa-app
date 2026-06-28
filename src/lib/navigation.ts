/** Landing pública de bolões; a lista pessoal exige sessão autenticada. */
export const MEUS_BOLOES_PATH = '/meus-boloes';

/** Regras do bolão e critérios de pontuação (página pública). */
export const REGRAS_E_PONTUACAO_PATH = '/regras-e-pontuacao';

/** Sobre o projeto e opção de apoio ao custo público do site. */
export const SOBRE_PATH = '/sobre';

/** Pedido de criação de novo bolão (requer login). */
export const CRIAR_BOLOAO_PATH = '/criar-bolao';

/** Página inicial: placar Copa. */
export const HOME_PATH = '/';

/** Palpites do usuário (requer login). */
export const PALPITES_PATH = '/palpites';

/** Ranking geral de todos os participantes (página pública). */
export const RANKING_GLOBAL_PATH = '/ranking';

/** Página pública de uma seleção (`documentId` do time no Strapi). */
export function selecaoPath(teamDocumentId: string): string {
  return `/selecao/${encodeURIComponent(teamDocumentId)}`;
}

/** Página pública de uma partida (`documentId` da partida no Strapi). */
export function partidaPath(matchDocumentId: string): string {
  return `/partida/${encodeURIComponent(matchDocumentId)}`;
}

/** Ranking de um bolão (`documentId` do pool no Strapi). */
export function poolRankingPath(poolDocumentId: string): string {
  return `/pool/${encodeURIComponent(poolDocumentId)}/ranking`;
}

/** Pedido de e-mail para redefinir senha. */
export const FORGOT_PASSWORD_PATH = '/forgot-password';

/** Nova senha a partir do link enviado por e-mail. */
export const RESET_PASSWORD_PATH = '/reset-password';

/** Retorno do OAuth Google após o Strapi redirecionar o navegador. */
export const GOOGLE_CONNECT_REDIRECT_PATH = '/connect/google/redirect';

/** Alias legado do redirect do Google OAuth no front-end. */
export const GOOGLE_AUTH_CALLBACK_PATH = '/auth/google/callback';

export const GOOGLE_AUTH_CALLBACK_PATHS = [
  GOOGLE_CONNECT_REDIRECT_PATH,
  GOOGLE_AUTH_CALLBACK_PATH,
] as const;

export function isGoogleAuthCallbackPath(pathname: string): boolean {
  return GOOGLE_AUTH_CALLBACK_PATHS.includes(
    pathname as (typeof GOOGLE_AUTH_CALLBACK_PATHS)[number]
  );
}

/** Query param da aba na home: `all` | `today` | `groups` | `knockout`. */
export const HOME_TAB_QUERY_KEY = 'tab';

/** Internal path only; prevents open redirects via `returnUrl`. */
export function safeReturnUrl(
  raw: string | null | undefined,
  fallback = HOME_PATH
): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;
  return trimmed;
}
