'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { PoolNav } from '@/components/PoolNav/poolNav';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import { normalizePoolFromApi } from '@/lib/pool-normalize';
import { isSameUser } from '@/lib/user-match';
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
  const pathname = usePathname();
  const router = useRouter();
  const { jwt, user, hasHydrated } = useAuthStore();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [pool, setPool] = useState<Pool | null>(null);

  /** Alinha sessão com Strapi (ex.: `documentId`) para comparar com `pool.admin`. */
  useEffect(() => {
    if (!hasHydrated || !jwt) return;
    getMe(jwt)
      .then((fresh) => setAuth(fresh, jwt))
      .catch(() => {
        /* token inválido: fluxo de login cobre outras páginas */
      });
  }, [hasHydrated, jwt, setAuth]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.push('/login');
      return;
    }

    apiFetch<unknown>(
      `/api/pools/${poolId}?populate[admin]=true`,
      {},
      jwt
    )
      .then((res) => {
        const normalized = normalizePoolFromApi(res);
        if (normalized) setPool(normalized);
        else router.push(MEUS_BOLOES_PATH);
      })
      .catch(() => router.push(MEUS_BOLOES_PATH));
  }, [jwt, poolId, router, hasHydrated]);

  if (!hasHydrated || !pool) return <p>Carregando...</p>;

  const isAdmin = isSameUser(pool.admin, user);
  const isRankingPage = pathname?.includes('/ranking') ?? false;
  const poolDescription = pool.description?.trim();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="min-w-0 flex-1">
          <Link href={MEUS_BOLOES_PATH} className="text-sm underline">
            ← Meus bolões
          </Link>
          <h1 className="text-xl font-bold mt-1">{pool.name}</h1>
          {isRankingPage && poolDescription ? (
            <p className="text-sm text-neutral-600 mt-2 max-w-prose leading-relaxed whitespace-pre-wrap">
              {poolDescription}
            </p>
          ) : null}
        </div>
      </div>
      {isAdmin ? <AdminInviteCard pool={pool} /> : null}
      <PoolNav poolId={poolId} isAdmin={isAdmin} />
      {children}
    </div>
  );
}
