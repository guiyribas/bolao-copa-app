'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  fetchPoolByInviteCode,
  joinPoolByInviteCode,
  resolvePoolDocumentIdFromJoinResponse,
} from '@/lib/pools';
import {
  isAlreadyMemberError,
  messageForJoinError,
} from '@/lib/join-messages';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { MEUS_BOLOES_PATH } from '@/lib/navigation';
import type { Pool } from '@/types';

export default function InvitePage() {
  const params = useParams();
  const inviteCode = params.inviteCode as string;
  const router = useRouter();
  const { jwt, hasHydrated } = useAuthStore();

  const [pool, setPool] = useState<Pool | null>(null);
  const [poolError, setPoolError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [retryBusy, setRetryBusy] = useState(false);
  const joinStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchPoolByInviteCode(inviteCode)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setPoolError(
            'Convite inválido ou bolão não encontrado.'
          );
          setPool(null);
          return;
        }
        setPoolError('');
        setPool(p);
      })
      .catch(() => {
        if (!cancelled) {
          setPool(null);
          setPoolError(
            'Não foi possível verificar o convite. Tente novamente.'
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  const goToPool = useCallback(
    (documentId: string) => {
      router.replace(`/pool/${documentId}/ranking`);
    },
    [router]
  );

  const runJoin = useCallback(async () => {
    if (!jwt || !pool) return;
    setJoinError('');
    try {
      const body = await joinPoolByInviteCode(inviteCode, jwt);
      const id =
        resolvePoolDocumentIdFromJoinResponse(body) ?? pool.documentId;
      goToPool(id);
    } catch (err: unknown) {
      if (isAlreadyMemberError(err) && pool) {
        goToPool(pool.documentId);
        return;
      }
      setJoinError(messageForJoinError(err));
    } finally {
      setRetryBusy(false);
    }
  }, [jwt, pool, inviteCode, goToPool]);

  useEffect(() => {
    if (!hasHydrated || !inviteCode) return;
    if (!jwt) {
      const returnUrl = `/invite/${encodeURIComponent(inviteCode)}`;
      router.replace(
        `/login?returnUrl=${encodeURIComponent(returnUrl)}`
      );
    }
  }, [hasHydrated, jwt, inviteCode, router]);

  useEffect(() => {
    if (
      !hasHydrated ||
      !jwt ||
      !pool ||
      joinStarted.current ||
      poolError
    ) {
      return;
    }
    joinStarted.current = true;
    void runJoin();
  }, [hasHydrated, jwt, pool, poolError, runJoin]);

  if (!hasHydrated) {
    return <p className="mt-16 text-center">Carregando...</p>;
  }

  if (!jwt) {
    return (
      <p className="mt-16 text-center text-gray-600">
        Redirecionando para o login...
      </p>
    );
  }

  if (poolError) {
    return (
      <div className="mt-16">
        <PageBreadcrumb label="Convite" className="mb-4" />
        <div className="text-center">
          <p className="text-red-600 mb-4">{poolError}</p>
          <Link href={MEUS_BOLOES_PATH} className="underline text-sm">
            Voltar aos bolões
          </Link>
        </div>
      </div>
    );
  }

  if (!pool || pool.inviteCode !== inviteCode) {
    return <p className="mt-16 text-center">Carregando convite...</p>;
  }

  if (joinError) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center">
        <PageBreadcrumb label="Convite" className="mb-4 text-left" />
        <h1 className="text-lg font-bold mb-2">{pool.name}</h1>
        <p className="text-red-600 text-sm mb-6">{joinError}</p>
        <button
          type="button"
          disabled={retryBusy}
          onClick={() => {
            setRetryBusy(true);
            void runJoin();
          }}
          className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {retryBusy ? 'Tentando...' : 'Tentar novamente'}
        </button>
        <p className="mt-6">
          <Link href={MEUS_BOLOES_PATH} className="underline text-sm">
            Voltar aos bolões
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 text-center">
      <p className="text-lg mb-2">Entrando em {pool.name}…</p>
      <p className="text-sm text-gray-600">Aguarde um instante.</p>
    </div>
  );
}
