import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Match } from '@/types';
import {
  bracketCenterCellPlacement,
  bracketWingCellPlacement,
  getBracketHalfSlotRange,
  padPhaseSlots,
} from './knockoutBracket.utils';
import {
  BRACKET_CENTER_COLUMN_INDEX,
  BRACKET_RIGHT_WING_COLUMN_START,
} from './knockoutBracket.constants';

function makeMatch(matchNumber: number, phase: Match['phase']): Match {
  return {
    documentId: `match-${matchNumber}`,
    homeTeam: { documentId: 'h', name: 'Home', code: 'HOM', group: 'A' },
    awayTeam: { documentId: 'a', name: 'Away', code: 'AWY', group: 'B' },
    date: '2026-07-01T00:00:00.000Z',
    venue: 'Stadium',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    phase,
    matchNumber,
  };
}

describe('padPhaseSlots', () => {
  it('coloca match 90 no slot 0 das oitavas e matches 73/75 nos slots 0/1 da segunda fase', () => {
    const r32 = [73, 74, 75, 76].map((n) => makeMatch(n, 'round_of_32'));
    const r16 = [89, 90].map((n) => makeMatch(n, 'round_of_16'));

    const r32Slots = padPhaseSlots(r32, 'round_of_32', 16);
    const r16Slots = padPhaseSlots(r16, 'round_of_16', 8);

    assert.equal(r32Slots[0]?.matchNumber, 73);
    assert.equal(r32Slots[1]?.matchNumber, 75);
    assert.equal(r32Slots[2]?.matchNumber, 74);
    assert.equal(r32Slots[8]?.matchNumber, 76);

    assert.equal(r16Slots[0]?.matchNumber, 90);
    assert.equal(r16Slots[1]?.matchNumber, 89);
  });
});

describe('getBracketHalfSlotRange', () => {
  it('divide slots por metade em cada fase', () => {
    assert.deepEqual(getBracketHalfSlotRange('round_of_32', 'left'), {
      start: 0,
      count: 8,
    });
    assert.deepEqual(getBracketHalfSlotRange('round_of_32', 'right'), {
      start: 8,
      count: 8,
    });
    assert.deepEqual(getBracketHalfSlotRange('round_of_16', 'left'), {
      start: 0,
      count: 4,
    });
    assert.deepEqual(getBracketHalfSlotRange('quarter', 'right'), {
      start: 2,
      count: 2,
    });
    assert.deepEqual(getBracketHalfSlotRange('semi', 'left'), {
      start: 0,
      count: 1,
    });
    assert.deepEqual(getBracketHalfSlotRange('semi', 'right'), {
      start: 1,
      count: 1,
    });
  });
});

describe('bracketWingCellPlacement', () => {
  it('posiciona slot 0 da segunda fase esquerda na linha 2 com span 1', () => {
    const placement = bracketWingCellPlacement({
      side: 'left',
      phase: 'round_of_32',
      localSlotIndex: 0,
      wingColumnIndex: 0,
    });

    assert.equal(placement.gridColumn, 1);
    assert.equal(placement.gridRow, '2 / span 1');
  });

  it('posiciona semifinal esquerda ocupando as 8 linhas da asa', () => {
    const placement = bracketWingCellPlacement({
      side: 'left',
      phase: 'semi',
      localSlotIndex: 0,
      wingColumnIndex: 3,
    });

    assert.equal(placement.gridColumn, 4);
    assert.equal(placement.gridRow, '2 / span 8');
  });

  it('posiciona asa direita a partir da coluna 6', () => {
    const placement = bracketWingCellPlacement({
      side: 'right',
      phase: 'round_of_32',
      localSlotIndex: 0,
      wingColumnIndex: 3,
    });

    assert.equal(placement.gridColumn, BRACKET_RIGHT_WING_COLUMN_START + 3);
    assert.equal(placement.gridRow, '2 / span 1');
  });
});

describe('bracketCenterCellPlacement', () => {
  it('alinha a Final com as semifinais na coluna central', () => {
    const final = bracketCenterCellPlacement();

    assert.equal(final.gridColumn, BRACKET_CENTER_COLUMN_INDEX);
    assert.equal(final.gridRow, '2 / span 8');
  });
});
