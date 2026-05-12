import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  localCalendarDayKeyFromDate,
  pickNearestMatchDayKey,
} from '@/components/MatchCard/matchCard.utils';

describe('pickNearestMatchDayKey', () => {
  const ref = new Date(2026, 4, 12);

  it('returns null for an empty list', () => {
    assert.equal(pickNearestMatchDayKey([], ref), null);
  });

  it('prefers today when matches exist on the reference day', () => {
    const dayKeys = ['2026-05-10', '2026-05-12', '2026-05-14'];

    assert.equal(pickNearestMatchDayKey(dayKeys, ref), '2026-05-12');
  });

  it('returns the next future day when there are no matches today', () => {
    const dayKeys = ['2026-05-10', '2026-05-13', '2026-05-15'];

    assert.equal(pickNearestMatchDayKey(dayKeys, ref), '2026-05-13');
  });

  it('returns null when only past days have matches', () => {
    const dayKeys = ['2026-05-08', '2026-05-10', '2026-05-11'];

    assert.equal(pickNearestMatchDayKey(dayKeys, ref), null);
  });
});

describe('localCalendarDayKeyFromDate', () => {
  it('formats the local calendar day as YYYY-MM-DD', () => {
    assert.equal(
      localCalendarDayKeyFromDate(new Date(2026, 4, 12)),
      '2026-05-12'
    );
  });
});
