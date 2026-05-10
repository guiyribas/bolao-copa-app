'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { PoolNav } from '@/components/PoolNav/poolNav';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import type { Pool } from '@/types';

function AdminInviteCard({ pool }: { pool: Pool }) {
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== 'undefined' ? window.location.origin : '';
  const displayLink =
    (pool.inviteLink && pool.inviteLink.trim()) ||
    (origin && pool.inviteCode
      ? `${origin}/invite/${pool.inviteCode}`
      : '');

  async function copyLink() {
    if (!displayLink) return;
    try {
      await navigator.clipboard.writeText(displayLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (!pool.inviteCode) return null;

  return (
    <section
      className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm"
      aria-labelledby="invite-heading"
    >
      <h2 id="invite-heading" className="font-semibold text-gray-900 mb-2">
        Convidar participantes
      </h2>
      <p className="text-gray-600 mb-3 break-all">
        {displayLink || 'Carregando link...'}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          disabled={!displayLink}
          className="rounded bg-black px-3 py-1.5 text-white text-sm disabled:opacity-50"
        >
          {copied ? 'Copiado!' : 'Copiar link'}
        </button>
        <span className="text-gray-500 text-xs">
          Código:{' '}
          <code className="rounded bg-white px-1.5 py-0.5 border border-gray-200">
            {pool.inviteCode}
          </code>
        </span>
      </div>
    </section>
  );
}

export default function PoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const poolId = params.poolId as string;
  const router = useRouter();
  const { jwt, user, hasHydrated } = useAuthStore();
  const [pool, setPool] = useState<Pool | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    apiFetch<{ data: Pool }>(
      `/api/pools/${poolId}?populate=admin`,
      {},
      jwt
    )
      .then((res) => setPool(res.data))
      .catch(() => router.push(MEUS_BOLOES_PATH));
  }, [jwt, poolId, router, hasHydrated]);

  if (!hasHydrated || !pool) return <p>Carregando...</p>;

  const isAdmin = pool.admin?.id === user?.id;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Link href={MEUS_BOLOES_PATH} className="text-sm underline">
            ← Meus bolões
          </Link>
          <h1 className="text-xl font-bold mt-1">{pool.name}</h1>
        </div>
      </div>
      {isAdmin ? <AdminInviteCard pool={pool} /> : null}
      <PoolNav poolId={poolId} isAdmin={isAdmin} />
      {children}
    </div>
  );
}
