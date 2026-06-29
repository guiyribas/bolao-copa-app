import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Match } from '@/types';

import { pickLiveMatch } from './pick-live-match';

const kickoffEarly = '2026-06-11T19:00:00.000Z';
const kickoffLate = '2026-06-11T21:00:00.000Z';
const beforeKickoff = new Date('2026-06-11T18:59:00.000Z').getTime();
const afterKickoff = new Date('2026-06-11T19:30:00.000Z').getTime();

function match(overrides: Partial<Match> & Pick<Match, 'documentId' | 'date'>): Match {
  return {
    homeTeam: { documentId: 'h', name: 'Home', code: 'HOM', group: 'A' },
    awayTeam: { documentId: 'a', name: 'Away', code: 'AWY', group: 'A' },
    venue: 'Arena',
    homeScore: null,
    awayScore: null,
    phase: 'group',
    status: 'scheduled',
    matchNumber: 1,
    ...overrides,
  };
}

describe('pickLiveMatch', () => {
  it('returns null for an empty list', () => {
    assert.equal(pickLiveMatch([], afterKickoff), null);
  });

  it('returns null when no match is effectively live', () => {
    const scheduled = match({
      documentId: 'm1',
      date: kickoffEarly,
      status: 'scheduled',
    });
    assert.equal(pickLiveMatch([scheduled], beforeKickoff), null);
  });

  it('treats scheduled matches after kickoff as live', () => {
    const liveByClock = match({
      documentId: 'm1',
      date: kickoffEarly,
      status: 'scheduled',
    });
    assert.equal(pickLiveMatch([liveByClock], afterKickoff), liveByClock);
  });

  it('ignores finished matches', () => {
    const finished = match({
      documentId: 'm1',
      date: kickoffEarly,
      status: 'finished',
      homeScore: 1,
      awayScore: 0,
    });
    assert.equal(pickLiveMatch([finished], afterKickoff), null);
  });

  it('picks the earliest live match by date', () => {
    const earlier = match({
      documentId: 'm1',
      date: kickoffEarly,
      status: 'live',
    });
    const later = match({
      documentId: 'm2',
      date: kickoffLate,
      status: 'live',
    });
    assert.equal(pickLiveMatch([later, earlier], afterKickoff), earlier);
  });
});
