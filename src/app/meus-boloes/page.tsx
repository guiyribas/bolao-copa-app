'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { HOME_PATH } from '@/lib/navigation';
import type { PoolMembership } from '@/types';

export default function MeusBoloesPage() {
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();
  const [memberships, setMemberships] = useState<PoolMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    apiFetch<{ data: PoolMembership[] }>('/api/pools/mine/memberships', {}, jwt)
      .then((res) => setMemberships(res.data || []))
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [jwt, router, hasHydrated]);

  if (!hasHydrated) return <p>Carregando...</p>;
  if (!jwt) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Meus bolões</h1>
        <p className="text-sm text-neutral-600 mt-1">
          Copa e placar oficial ficam na{' '}
          <Link href={HOME_PATH} className="underline font-medium text-neutral-800">
            página inicial
          </Link>
          .
        </p>
        <p className="text-sm text-neutral-500 mt-2 max-w-xl">
          Se você é <strong className="font-medium text-neutral-700">administrador</strong> de um
          bolão, entre nele pelo link abaixo: aparecerão a aba{' '}
          <strong className="font-medium text-neutral-700">Admin</strong> (pagamentos e convites) e o
          bloco para copiar o link de convite. Isso fica neste site, não no painel do Strapi.
        </p>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : memberships.length === 0 ? (
        <p className="text-neutral-600">
          Você ainda não participa de nenhum bolão. Peça um link de convite!
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-neutral-600">
              <th className="py-2 pr-4 font-medium">Bolão</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((m) => (
              <tr
                key={m.documentId}
                className="border-b border-neutral-100 hover:bg-neutral-50/80 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-medium text-neutral-900">{m.pool.name}</span>
                    <Link
                      href={`/pool/${m.pool.documentId}/ranking`}
                      className="shrink-0 text-sm font-medium text-neutral-800 underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-800"
                    >
                      Acessar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
