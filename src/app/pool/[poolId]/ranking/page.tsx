'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { RankingTable } from '@/components/RankingTable/rankingTable';
import type { RankingEntry } from '@/types';

function pickNum(row: Record<string, unknown>, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = row[k];
    if (v != null && v !== '' && typeof v === 'number' && !Number.isNaN(v)) return v;
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

/** Aceita vários formatos da API (camelCase / snake_case / nomes alternativos). */
function normalizeRankingEntry(raw: unknown): RankingEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  const userId = row.userId ?? row.user_id;
  const username = row.username;
  if (userId == null || username == null) return null;

  const points =
    pickNum(row, ['points', 'pointsTotal', 'points_total', 'totalPoints']) ?? 0;

  const pointsGroupPhase = pickNum(row, [
    'pointsGroupPhase',
    'points_group_phase',
    'pointsGroup',
    'points_group',
    'groupPhasePoints',
  ]);

  const pointsKnockout = pickNum(row, [
    'pointsKnockout',
    'points_knockout',
    'knockoutPoints',
    'mataMataPoints',
  ]);

  return {
    userId: String(userId),
    username: String(username),
    points,
    pointsGroupPhase: pointsGroupPhase ?? null,
    pointsKnockout: pointsKnockout ?? null,
  };
}

export default function RankingPage() {
  const params = useParams();
  const poolId = params.poolId as string;
  const { jwt, hasHydrated } = useAuthStore();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated || !jwt) return;
    apiFetch<{ data: unknown[] }>(`/api/pools/${poolId}/ranking`, {}, jwt)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setRanking(
          rows
            .map(normalizeRankingEntry)
            .filter((e): e is RankingEntry => e != null)
        );
      })
      .finally(() => setLoading(false));
  }, [jwt, poolId, hasHydrated]);

  if (loading) {
    return (
      <div>
        <p>Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Ranking</h2>
      {ranking.length === 0 ? (
        <p className="text-gray-500">Nenhum palpite computado ainda.</p>
      ) : (
        <RankingTable ranking={ranking} />
      )}
    </div>
  );
}
