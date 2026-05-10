'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import type { MemberEntry } from '@/types';

export default function AdminPage() {
  const params = useParams();
  const poolId = params.poolId as string;
  const { jwt, hasHydrated } = useAuthStore();
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasHydrated || !jwt) return;
    apiFetch<{ data: MemberEntry[] }>(
      `/api/pools/${poolId}/members`,
      {},
      jwt
    )
      .then((res) => setMembers(res.data || []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
      )
      .finally(() => setLoading(false));
  }, [jwt, poolId, hasHydrated]);

  async function togglePayment(userDocumentId: string, currentStatus: boolean) {
    if (!jwt) return;
    await apiFetch(
      `/api/pools/${poolId}/members/${encodeURIComponent(userDocumentId)}/payment`,
      {
        method: 'PATCH',
        body: JSON.stringify({ hasPaid: !currentStatus }),
      },
      jwt
    );
    setMembers((prev) =>
      prev.map((m) =>
        m.userDocumentId === userDocumentId
          ? { ...m, hasPaid: !currentStatus }
          : m
      )
    );
  }

  if (loading) return <p>Carregando membros...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Administração</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2 text-center">Pago</th>
            <th className="py-2 text-right">Entrada</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.userDocumentId || String(m.id)} className="border-b">
              <td className="py-2">{m.username}</td>
              <td className="py-2 text-gray-600">{m.email}</td>
              <td className="py-2 text-center">
                <input
                  type="checkbox"
                  checked={m.hasPaid}
                  onChange={() => togglePayment(m.userDocumentId, m.hasPaid)}
                  disabled={!m.userDocumentId}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              <td className="py-2 text-right text-xs text-gray-500">
                {new Date(m.joinedAt).toLocaleDateString('pt-BR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
