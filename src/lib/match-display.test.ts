import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getEffectiveMatchStatus,
  hasKickoffPassed,
  matchNeedsDisplayClock,
  resolveDisplayScores,
} from './match-display';

const kickoff = '2026-06-11T19:00:00.000Z';
const beforeKickoff = new Date('2026-06-11T18:59:00.000Z').getTime();
const afterKickoff = new Date('2026-06-11T19:01:00.000Z').getTime();

describe('hasKickoffPassed', () => {
  it('returns false before kickoff', () => {
    assert.equal(hasKickoffPassed({ date: kickoff }, beforeKickoff), false);
  });

  it('returns true after kickoff', () => {
    assert.equal(hasKickoffPassed({ date: kickoff }, afterKickoff), true);
  });
});

describe('getEffectiveMatchStatus', () => {
  it('keeps scheduled before kickoff', () => {
    assert.equal(
      getEffectiveMatchStatus({ date: kickoff, status: 'scheduled' }, beforeKickoff),
      'scheduled'
    );
  });

  it('shows live after kickoff when API still says scheduled', () => {
    assert.equal(
      getEffectiveMatchStatus({ date: kickoff, status: 'scheduled' }, afterKickoff),
      'live'
    );
  });

  it('respects finished status from the API', () => {
    assert.equal(
      getEffectiveMatchStatus({ date: kickoff, status: 'finished' }, afterKickoff),
      'finished'
    );
  });
});

describe('resolveDisplayScores', () => {
  it('returns null before kickoff (dash placeholder in UI)', () => {
    assert.equal(
      resolveDisplayScores(
        { date: kickoff, status: 'scheduled', homeScore: null, awayScore: null },
        beforeKickoff
      ),
      null
    );
  });

  it('returns 0x0 after kickoff when API has no score yet', () => {
    assert.deepEqual(
      resolveDisplayScores(
        { date: kickoff, status: 'scheduled', homeScore: null, awayScore: null },
        afterKickoff
      ),
      { home: 0, away: 0, isPlaceholder: true }
    );
  });

  it('returns real scores when the API already sent them', () => {
    assert.deepEqual(
      resolveDisplayScores(
        { date: kickoff, status: 'live', homeScore: 1, awayScore: 1 },
        afterKickoff
      ),
      { home: 1, away: 1, isPlaceholder: false }
    );
  });

  it('does not invent a score for finished matches without a result', () => {
    assert.equal(
      resolveDisplayScores(
        { date: kickoff, status: 'finished', homeScore: null, awayScore: null },
        afterKickoff
      ),
      null
    );
  });

  it('returns 0x0 for live matches without scores after kickoff', () => {
    assert.deepEqual(
      resolveDisplayScores(
        { date: kickoff, status: 'live', homeScore: null, awayScore: null },
        afterKickoff
      ),
      { home: 0, away: 0, isPlaceholder: true }
    );
  });
});

describe('matchNeedsDisplayClock', () => {
  it('only enables the clock for scheduled matches within 24h', () => {
    assert.equal(
      matchNeedsDisplayClock(
        { date: kickoff, status: 'scheduled', homeScore: null, awayScore: null },
        beforeKickoff
      ),
      true
    );
    assert.equal(
      matchNeedsDisplayClock(
        { date: kickoff, status: 'live', homeScore: 0, awayScore: 0 },
        beforeKickoff
      ),
      false
    );
  });
});
