'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { usePoolLayout } from '@/contexts/pool-layout-context';
import { apiFetch } from '@/lib/api';
import { showErrorToast } from '@/lib/toast';
import { isSameUser } from '@/lib/user-match';
import {
  extractMembersFromResponse,
  normalizeMemberEntry,
} from '@/lib/member-entry';
import type { MemberEntry } from '@/types';

/** `pool.value` é armazenado em centavos; o input mostra em reais (ex.: "50,00"). */
function centsToReaisInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

function AdminPoolSettingsForm() {
  const params = useParams();
  const poolId = params.poolId as string;
  const { jwt } = useAuthStore();
  const { pool, refreshPool, isAdmin } = usePoolLayout();
  const [name, setName] = useState(pool.name);
  const [description, setDescription] = useState(pool.description ?? '');
  const [valueInput, setValueInput] = useState(
    centsToReaisInput(pool.value ?? 0)
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(pool.name);
    setDescription(pool.description ?? '');
    setValueInput(centsToReaisInput(pool.value ?? 0));
  }, [pool]);

  if (!isAdmin) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!jwt) return;
    const reais = Number(String(valueInput).replace(',', '.'));
    if (Number.isNaN(reais) || reais < 0) {
      showErrorToast(new Error('Indique um valor válido (≥ 0).'));
      return;
    }
    const valueCents = Math.round(reais * 100);
    setSaving(true);
    try {
      await apiFetch(
        `/api/pools/${poolId}/settings`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() === '' ? null : description.trim(),
            value: valueCents,
          }),
        },
        jwt
      );
      await refreshPool();
    } catch (err) {
      showErrorToast(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm shadow-neutral-950/5">
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">
        Dados do bolão
      </h3>
      <form onSubmit={onSubmit} className="w-full space-y-4">
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[3fr_1fr] lg:items-end lg:gap-x-6">
          <div className="min-w-0">
            <label
              htmlFor="pool-admin-name"
              className="block text-xs font-medium text-neutral-600 mb-1"
            >
              Nome
            </label>
            <input
              id="pool-admin-name"
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <div className="min-w-0">
            <label
              htmlFor="pool-admin-value"
              className="block text-xs font-medium text-neutral-600 mb-1"
            >
              Valor por participante (R$)
            </label>
            <div className="relative w-full">
              <span
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-neutral-500"
                aria-hidden
              >
                R$
              </span>
              <input
                id="pool-admin-value"
                type="text"
                inputMode="decimal"
                value={valueInput}
                onChange={(ev) => setValueInput(ev.target.value)}
                required
                placeholder="0,00"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 pl-9 text-sm text-neutral-900 tabular-nums focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <label
            htmlFor="pool-admin-description"
            className="block text-xs font-medium text-neutral-600 mb-1"
          >
            Descrição
          </label>
          <textarea
            id="pool-admin-description"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={8}
            className="min-h-44 w-full resize-y rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 sm:w-auto"
        >
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </form>
    </section>
  );
}

function memberAsUser(member: MemberEntry) {
  return {
    id: member.id,
    documentId: member.userDocumentId,
    username: member.username,
    email: member.email,
  };
}

export default function AdminPage() {
  const params = useParams();
  const poolId = params.poolId as string;
  const { jwt, hasHydrated } = useAuthStore();
  const { pool, refreshPool } = usePoolLayout();
  const [members, setMembers] = useState<MemberEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingUserDocumentId, setPendingUserDocumentId] = useState<
    string | null
  >(null);
  const [memberPendingRemoval, setMemberPendingRemoval] =
    useState<MemberEntry | null>(null);
  const [removingUserDocumentId, setRemovingUserDocumentId] = useState<
    string | null
  >(null);
  const confirmDialogRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!memberPendingRemoval) return;

    confirmDialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMemberPendingRemoval(null);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [memberPendingRemoval]);

  async function confirmRemoveMember() {
    const member = memberPendingRemoval;
    if (!jwt || !member?.userDocumentId) return;

    const userDocumentId = member.userDocumentId;
    setRemovingUserDocumentId(userDocumentId);
    try {
      await apiFetch(
        `/api/pools/${poolId}/members/${encodeURIComponent(userDocumentId)}`,
        { method: 'DELETE' },
        jwt
      );
      setMembers((prev) =>
        prev.filter((m) => m.userDocumentId !== userDocumentId)
      );
      setMemberPendingRemoval(null);
      await refreshPool();
    } catch (e) {
      showErrorToast(e);
    } finally {
      setRemovingUserDocumentId(null);
    }
  }

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

  if (loading) {
    return (
      <div>
        <p>Carregando membros...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Administração</h2>
      <p className="text-sm text-neutral-600 mb-4 max-w-prose">
        Marque quem já quitou a participação no bolão. Participantes sem marcação
        aparecem como pendentes de pagamento.
      </p>

      <AdminPoolSettingsForm />

      <div className="rounded-xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-950/5 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <th className="py-3 pl-4 pr-2">Nome</th>
              <th className="py-3 pr-2 hidden sm:table-cell">Email</th>
              <th className="py-3 px-2 text-center">Pagamento</th>
              <th className="py-3 pr-2 text-right">Entrada</th>
              <th className="py-3 pr-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const busy =
                pendingUserDocumentId !== null &&
                pendingUserDocumentId === m.userDocumentId;
              const removing =
                removingUserDocumentId !== null &&
                removingUserDocumentId === m.userDocumentId;
              const canToggle = Boolean(m.userDocumentId);
              const isPoolAdminMember = isSameUser(pool.admin, memberAsUser(m));
              const canRemove = canToggle && !isPoolAdminMember;
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
                  <td className="py-3 pr-2 text-right text-xs text-neutral-500 tabular-nums">
                    {new Date(m.joinedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    {canRemove ? (
                      <button
                        type="button"
                        aria-label={`Remover ${m.username} do bolão`}
                        disabled={removing}
                        onClick={() => setMemberPendingRemoval(m)}
                        className="inline-flex items-center justify-center rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-lg" aria-hidden>
                          delete
                        </span>
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {memberPendingRemoval ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-member-title"
          onClick={() => setMemberPendingRemoval(null)}
        >
          <div
            ref={confirmDialogRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-xl shadow-neutral-950/10 outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="remove-member-title"
              className="text-base font-semibold text-neutral-900"
            >
              Remover participante
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Tem certeza de que deseja remover{' '}
              <span className="font-medium text-neutral-900">
                {memberPendingRemoval.username}
              </span>{' '}
              deste bolão?
            </p>
            {memberPendingRemoval.hasPaid ? (
              <p className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Este participante está marcado como pago. A exclusão não reverte
                automaticamente o pagamento.
              </p>
            ) : null}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setMemberPendingRemoval(null)}
                disabled={removingUserDocumentId !== null}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void confirmRemoveMember()}
                disabled={removingUserDocumentId !== null}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {removingUserDocumentId !== null ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
