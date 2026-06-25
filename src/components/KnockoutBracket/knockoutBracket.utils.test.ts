import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Match } from '@/types';
import { padPhaseSlots } from './knockoutBracket.utils';

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
