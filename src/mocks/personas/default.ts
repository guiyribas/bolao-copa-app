import type { MockPersona } from '@/mocks/types';
import {
  TEAM_ARG,
  TEAM_BRA,
  TEAM_ESP,
  TEAM_FRA,
  TEAM_GER,
} from '@/mocks/fixtures/teams';

function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 1000).toISOString();
}

function hoursFromNow(n: number): string {
  return new Date(Date.now() + n * 60 * 60 * 1000).toISOString();
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const mockUser = {
  id: 1,
  documentId: 'user-mock-1',
  username: 'Mock User',
  email: 'mock@local.dev',
} as const;

const mockPool = {
  documentId: 'pool-mock-1',
  name: 'Bolão da Família',
  value: 2000,
  inviteCode: 'MOCK01',
} as const;

const viewerJoinedAt = daysAgo(14);

export const defaultPersona: MockPersona = {
  id: 'default',
  user: mockUser,
  memberships: [
    {
      documentId: 'membership-mock-1',
      pool: mockPool,
      user: mockUser,
      hasPaid: true,
      joinedAt: viewerJoinedAt,
      rankingPlace: 1,
      rankingTotal: 8,
    },
  ],
  poolSessions: {
    'pool-mock-1': {
      ...mockPool,
      isAdmin: true,
      memberCount: 8,
      paidCount: 6,
      totalCollected: 12000,
      viewerJoinedAt,
    },
  },
  matches: [
    {
      documentId: 'match-mock-live',
      title: 'Brasil x Argentina',
      homeTeam: TEAM_BRA,
      awayTeam: TEAM_ARG,
      date: minutesAgo(30),
      venue: 'Maracanã',
      homeScore: null,
      awayScore: null,
      phase: 'group',
      group: 'A',
      status: 'scheduled',
      matchNumber: 12,
    },
    {
      documentId: 'match-mock-future-1',
      title: 'França x Alemanha',
      homeTeam: TEAM_FRA,
      awayTeam: TEAM_GER,
      date: hoursFromNow(4),
      venue: 'Allianz Arena',
      homeScore: null,
      awayScore: null,
      phase: 'group',
      group: 'C',
      status: 'scheduled',
      matchNumber: 13,
    },
    {
      documentId: 'match-mock-future-2',
      title: 'Espanha x Brasil',
      homeTeam: TEAM_ESP,
      awayTeam: TEAM_BRA,
      date: hoursFromNow(28),
      venue: 'Santiago Bernabéu',
      homeScore: null,
      awayScore: null,
      phase: 'group',
      group: 'E',
      status: 'scheduled',
      matchNumber: 14,
    },
    {
      documentId: 'match-mock-finished',
      title: 'Alemanha x Argentina',
      homeTeam: TEAM_GER,
      awayTeam: TEAM_ARG,
      date: daysAgo(1),
      venue: 'Olympiastadion',
      homeScore: 2,
      awayScore: 1,
      phase: 'group',
      group: 'D',
      status: 'finished',
      matchNumber: 11,
    },
  ],
};
