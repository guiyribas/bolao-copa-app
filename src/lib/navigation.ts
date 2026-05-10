/** Lista de bolões do usuário autenticado. */
export const MEUS_BOLOES_PATH = '/meus-boloes';

/** Regras do bolão e critérios de pontuação (página pública). */
export const REGRAS_E_PONTUACAO_PATH = '/regras-e-pontuacao';

/** Sobre o projeto, pedido de novo bolão e opção de apoio ao custo público do site. */
export const SOBRE_PATH = '/sobre';

/** Página inicial: placar Copa. */
export const HOME_PATH = '/';

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
