'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { showErrorToast } from '@/lib/toast';
import {
  extractMembersFromResponse,
  normalizeMemberEntry,
} from '@/lib/member-entry';
import type { MemberEntry } from '@/types';

export default function AdminPage() {
  const params = useParams();
  const poolId = params.poolId as string;
  const { jwt, hasHydrated } = useAuthStore();
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingUserDocumentId, setPendingUserDocumentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!hasHydrated || !jwt) return;
    apiFetch<unknown>(`/api/pools/${poolId}/members`, {}, jwt)
      .then((res) => {
        const rows = extractMembersFromResponse(res);
        setMembers(
          rows
            .map(normalizeMemberEntry)
            .filter((m): m is MemberEntry => m != null)
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar')
      )
      .finally(() => setLoading(false));
  }, [jwt, poolId, hasHydrated]);

  async function togglePayment(userDocumentId: string, currentStatus: boolean) {
    if (!jwt || !userDocumentId) return;
    const next = !currentStatus;
    setPendingUserDocumentId(userDocumentId);
    try {
      await apiFetch(
        `/api/pools/${poolId}/members/${encodeURIComponent(userDocumentId)}/payment`,
        {
          method: 'PATCH',
          body: JSON.stringify({ hasPaid: next }),
        },
        jwt
      );
      setMembers((prev) =>
        prev.map((m) =>
          m.userDocumentId === userDocumentId ? { ...m, hasPaid: next } : m
        )
      );
    } catch (e) {
      showErrorToast(e);
    } finally {
      setPendingUserDocumentId(null);
    }
  }

  if (loading) return <p>Carregando membros...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Administração</h2>
      <p className="text-sm text-neutral-600 mb-4 max-w-prose">
        Marque quem já quitou a participação no bolão. Participantes sem marcação
        aparecem como pendentes de pagamento.
      </p>

      <div className="rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-950/5 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <th className="py-3 pl-4 pr-2">Nome</th>
              <th className="py-3 pr-2 hidden sm:table-cell">Email</th>
              <th className="py-3 px-2 text-center">Pagamento</th>
              <th className="py-3 pr-4 text-right">Entrada</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const busy =
                pendingUserDocumentId !== null &&
                pendingUserDocumentId === m.userDocumentId;
              const canToggle = Boolean(m.userDocumentId);
              return (
                <tr
                  key={m.membershipId || m.userDocumentId || String(m.id)}
                  className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/80 transition-colors"
                >
                  <td className="py-3 pl-4 pr-2 font-medium text-neutral-900">
                    {m.username}
                  </td>
                  <td className="py-3 pr-2 text-neutral-600 hidden sm:table-cell">
                    {m.email || '—'}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <span
                        className={
                          m.hasPaid
                            ? 'inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20'
                            : 'inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-inset ring-amber-600/25'
                        }
                      >
                        {m.hasPaid ? 'Pago' : 'Pendente'}
                      </span>
                      <label
                        className={`inline-flex items-center gap-2 cursor-pointer select-none ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={
                          !canToggle
                            ? 'Não foi possível identificar o usuário na API.'
                            : m.hasPaid
                              ? 'Marcar como não pago'
                              : 'Marcar como pago'
                        }
                      >
                        <input
                          type="checkbox"
                          checked={m.hasPaid}
                          disabled={!canToggle || busy}
                          onChange={() => togglePayment(m.userDocumentId, m.hasPaid)}
                          className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 disabled:cursor-not-allowed"
                        />
                        {busy ? (
                          <span className="text-xs text-neutral-500">Salvando…</span>
                        ) : null}
                      </label>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-xs text-neutral-500 tabular-nums">
                    {new Date(m.joinedAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {members.some((m) => !m.userDocumentId) ? (
        <p className="mt-3 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-lg px-3 py-2">
          Algumas linhas não permitem alterar o pagamento porque a API não enviou o
          identificador do usuário. Atualize o backend ou o populate da lista de
          membros.
        </p>
      ) : null}
    </div>
  );
}
