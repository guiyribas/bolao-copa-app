'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import {
  loginWithProvider,
  OAUTH_RETURN_URL_STORAGE_KEY,
} from '@/lib/auth';
import { safeReturnUrl } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';

function getOAuthQuery(search: string, hash: string): string {
  const params = new URLSearchParams(search);
  if (hash.startsWith('#')) {
    const hashParams = new URLSearchParams(hash.slice(1));
    hashParams.forEach((value, key) => {
      if (!params.has(key)) params.set(key, value);
    });
  }
  return params.toString();
}

export function GoogleAuthRedirectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      const oauthError =
        searchParams.get('error_description') ?? searchParams.get('error');
      if (oauthError) {
        setError(oauthError);
        return;
      }

      const query = getOAuthQuery(
        searchParams.toString(),
        typeof window !== 'undefined' ? window.location.hash : ''
      );
      if (!query) {
        setError('Não foi possível concluir o login com Google.');
        return;
      }

      const storedReturnUrl = sessionStorage.getItem(
        OAUTH_RETURN_URL_STORAGE_KEY
      );
      sessionStorage.removeItem(OAUTH_RETURN_URL_STORAGE_KEY);
      const returnUrl = safeReturnUrl(
        searchParams.get('returnUrl') ?? storedReturnUrl
      );

      try {
        const { user, jwt } = await loginWithProvider('google', query);
        if (cancelled) return;
        setAuth(user, jwt);
        router.replace(returnUrl);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Erro ao concluir login com Google';
        setError(
          message === 'Email is already taken.'
            ? 'Este e-mail já está vinculado a uma conta. Entre com e-mail e senha ou use o mesmo e-mail no Google.'
            : message
        );
      }
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams, setAuth]);

  return (
    <div className="max-w-sm mx-auto mt-16">
      <PageBreadcrumb label="Login com Google" className="mb-4" />
      <h1 className="text-xl font-bold mb-6">Login com Google</h1>
      {error ? (
        <>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Link href="/login" className="text-sm underline">
            Voltar ao login
          </Link>
        </>
      ) : (
        <p className="text-sm">Concluindo login...</p>
      )}
    </div>
  );
}
