import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PoolMembership } from '@/types';

import { pickPrimaryPoolMembership } from './pick-primary-pool-membership';

function membership(
  overrides: Partial<PoolMembership> & Pick<PoolMembership, 'documentId' | 'pool'>,
): PoolMembership {
  return {
    user: { id: 1, username: 'user', email: 'user@test.com' },
    hasPaid: true,
    joinedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function pool(name: string, documentId: string) {
  return {
    documentId,
    name,
    value: 10,
    inviteCode: 'abc',
  };
}

describe('pickPrimaryPoolMembership', () => {
  it('returns null for an empty list', () => {
    assert.equal(pickPrimaryPoolMembership([]), null);
  });

  it('returns the only membership', () => {
    const only = membership({
      documentId: 'm1',
      pool: pool('Família', 'p1'),
      rankingPlace: 3,
    });
    assert.equal(pickPrimaryPoolMembership([only]), only);
  });

  it('prefers the lowest rankingPlace', () => {
    const first = membership({
      documentId: 'm1',
      pool: pool('Alpha', 'p1'),
      rankingPlace: 1,
    });
    const second = membership({
      documentId: 'm2',
      pool: pool('Beta', 'p2'),
      rankingPlace: 2,
    });
    assert.equal(pickPrimaryPoolMembership([second, first]), first);
  });

  it('treats missing rankingPlace as last', () => {
    const ranked = membership({
      documentId: 'm1',
      pool: pool('Ranked', 'p1'),
      rankingPlace: 5,
    });
    const unranked = membership({
      documentId: 'm2',
      pool: pool('Unranked', 'p2'),
      rankingPlace: null,
    });
    assert.equal(pickPrimaryPoolMembership([unranked, ranked]), ranked);
  });

  it('breaks ranking ties by earliest joinedAt', () => {
    const earlier = membership({
      documentId: 'm1',
      pool: pool('Earlier', 'p1'),
      rankingPlace: 2,
      joinedAt: '2026-01-01T00:00:00.000Z',
    });
    const later = membership({
      documentId: 'm2',
      pool: pool('Later', 'p2'),
      rankingPlace: 2,
      joinedAt: '2026-02-01T00:00:00.000Z',
    });
    assert.equal(pickPrimaryPoolMembership([later, earlier]), earlier);
  });

  it('breaks joinedAt ties by pool name localeCompare pt-BR', () => {
    const alpha = membership({
      documentId: 'm1',
      pool: pool('Alpha', 'p1'),
      rankingPlace: 1,
      joinedAt: '2026-01-01T00:00:00.000Z',
    });
    const beta = membership({
      documentId: 'm2',
      pool: pool('Beta', 'p2'),
      rankingPlace: 1,
      joinedAt: '2026-01-01T00:00:00.000Z',
    });
    assert.equal(pickPrimaryPoolMembership([beta, alpha]), alpha);
  });
});
