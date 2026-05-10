/**
 * Texto público de regras, alinhado à tabela oficial do bolão.
 */

export const REGRAS_PONTUACAO_META = {
  title: 'Regras e pontuação',
  description:
    'Como funcionam palpites, bolões e pontos no Bolão Copa 2026.',
} as const;

/** Linhas da tabela (partidas): `pontos` (coluna Grupos); `faseFinal` (coluna Mata-mata). */
export const tabelaPontuacaoPartidas = [
  {
    titulo: 'Placar exato',
    detalhe: 'Ex.: palpite 2×2; resultado 2×2.',
    pontos: 10,
    faseFinal: 15,
  },
  {
    titulo: 'Vencedor da partida e gols do time vencedor',
    detalhe:
      'Ex.: palpite 2×1; resultado 2×0. Acerta quem vence e quantos gols marcou o time vencedor. Não vale se você tinha palpitado empate.',
    pontos: 8,
    faseFinal: 12,
  },
  {
    titulo: 'Vencedor da partida e saldo de gols',
    detalhe:
      'Ex.: palpite 3×2; resultado 2×1. Acerta o vencedor e a diferença de gols entre os times.',
    pontos: 7,
    faseFinal: 10,
  },
  {
    titulo: 'Acertou empate',
    detalhe:
      'Ex.: palpite 2×2; resultado 1×1. Previu corretamente que haveria empate.',
    pontos: 6,
    faseFinal: 9,
  },
  {
    titulo: 'Vencedor da partida e gols do time perdedor',
    detalhe: 'Ex.: palpite 3×1; resultado 2×1.',
    pontos: 5,
    faseFinal: 7,
  },
  {
    titulo: 'Apenas vencedor da partida',
    detalhe: 'Ex.: palpite 2×0; resultado 4×1.',
    pontos: 3,
    faseFinal: 5,
  },
] as const;

export const esclarecimentosPontuacao = [
  'A pontuação não é cumulativa.',
  'Por exemplo: se você palpitou 3×1 e o jogo terminou 2×1, você recebe 5 pontos e não 8, porque vale a combinação “vencedor + gols do perdedor”, que é a de maior pontuação entre as que se aplicam ao seu caso.',
] as const;
