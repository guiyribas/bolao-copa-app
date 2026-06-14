import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calculatePoints, resolvePoolBetDisplayPoints } from './bet-scoring';

describe('calculatePoints', () => {
  const group = { phase: 'group' as const };
  const ko = { phase: 'quarter' as const };

  it('placar exato — grupos', () => {
    assert.equal(
      calculatePoints({ homeScore: 2, awayScore: 2 }, { ...group, homeScore: 2, awayScore: 2 }),
      10
    );
  });

  it('placar exato — mata-mata', () => {
    assert.equal(
      calculatePoints({ homeScore: 1, awayScore: 0 }, { ...ko, homeScore: 1, awayScore: 0 }),
      15
    );
  });

  it('acertou empate — grupos', () => {
    assert.equal(
      calculatePoints({ homeScore: 2, awayScore: 2 }, { ...group, homeScore: 1, awayScore: 1 }),
      6
    );
  });

  it('vencedor errado — 0 pts', () => {
    assert.equal(
      calculatePoints({ homeScore: 2, awayScore: 1 }, { ...group, homeScore: 1, awayScore: 2 }),
      0
    );
  });

  it('vencedor + gols do vencedor — grupos', () => {
    assert.equal(
      calculatePoints({ homeScore: 2, awayScore: 1 }, { ...group, homeScore: 2, awayScore: 0 }),
      8
    );
  });

  it('fase desconhecida usa pontuação de grupos', () => {
    assert.equal(
      calculatePoints(
        { homeScore: 2, awayScore: 1 },
        { phase: 'friendly', homeScore: 2, awayScore: 0 }
      ),
      8
    );
  });
});

describe('resolvePoolBetDisplayPoints', () => {
  const kickoff = '2026-06-11T19:00:00.000Z';
  const afterKickoff = new Date('2026-06-11T19:01:00.000Z').getTime();
  const beforeKickoff = new Date('2026-06-11T18:59:00.000Z').getTime();

  const baseMatch = {
    date: kickoff,
    status: 'live' as const,
    homeScore: 2,
    awayScore: 1,
    phase: 'group',
  };

  it('usa pontos da API quando presentes', () => {
    assert.deepEqual(
      resolvePoolBetDisplayPoints(
        { homeScore: 2, awayScore: 1, points: 8 },
        baseMatch,
        afterKickoff
      ),
      { points: 8, isPartial: false }
    );
  });

  it('calcula pontuação parcial ao vivo', () => {
    assert.deepEqual(
      resolvePoolBetDisplayPoints(
        { homeScore: 2, awayScore: 0, points: null },
        baseMatch,
        afterKickoff
      ),
      { points: 8, isPartial: true }
    );
  });

  it('retorna null sem palpite revelado', () => {
    assert.equal(
      resolvePoolBetDisplayPoints(
        { homeScore: null, awayScore: null, points: null },
        baseMatch,
        afterKickoff
      ),
      null
    );
  });

  it('retorna null antes do kickoff', () => {
    assert.equal(
      resolvePoolBetDisplayPoints(
        { homeScore: 2, awayScore: 1, points: null },
        { ...baseMatch, status: 'scheduled', homeScore: null, awayScore: null },
        beforeKickoff
      ),
      null
    );
  });

  it('calcula com placeholder 0×0 após kickoff', () => {
    assert.deepEqual(
      resolvePoolBetDisplayPoints(
        { homeScore: 0, awayScore: 0, points: null },
        {
          date: kickoff,
          status: 'scheduled',
          homeScore: null,
          awayScore: null,
          phase: 'group',
        },
        afterKickoff
      ),
      { points: 10, isPartial: true }
    );
  });

  it('calcula quando finished mas API ainda não gravou pontos', () => {
    assert.deepEqual(
      resolvePoolBetDisplayPoints(
        { homeScore: 2, awayScore: 0, points: null },
        { ...baseMatch, status: 'finished' },
        afterKickoff
      ),
      { points: 8, isPartial: true }
    );
  });
});
