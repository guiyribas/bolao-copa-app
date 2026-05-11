'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { resetPassword } from '@/lib/auth';
import {
  FORGOT_PASSWORD_PATH,
  HOME_PATH,
  safeReturnUrl,
} from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';

const INVALID_LINK_MESSAGE =
  'Link inválido. Solicite um novo e-mail para redefinir a senha.';
const EXPIRED_LINK_MESSAGE =
  'Link inválido ou expirado. Solicite um novo e-mail.';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const returnUrl = safeReturnUrl(searchParams.get('returnUrl'));
  const code = searchParams.get('code')?.trim() ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const forgotPasswordHref =
    returnUrl !== HOME_PATH
      ? `${FORGOT_PASSWORD_PATH}?returnUrl=${encodeURIComponent(returnUrl)}`
      : FORGOT_PASSWORD_PATH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const { user, jwt } = await resetPassword(
        code,
        password,
        passwordConfirmation
      );
      setAuth(user, jwt);
      router.push(returnUrl);
    } catch {
      setError(EXPIRED_LINK_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  if (!code) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <PageBreadcrumb label="Redefinir senha" className="mb-4" />
        <h1 className="text-xl font-bold mb-6">Redefinir senha</h1>
        <p className="text-sm text-red-600">{INVALID_LINK_MESSAGE}</p>
        <p className="mt-4 text-sm">
          <Link href={forgotPasswordHref} className="underline">
            Solicitar novo e-mail
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <PageBreadcrumb label="Redefinir senha" className="mb-4" />
      <h1 className="text-xl font-bold mb-6">Redefinir senha</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={6}
          className="border px-3 py-2 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-sm">
          <Link href={forgotPasswordHref} className="underline">
            Solicitar novo e-mail
          </Link>
        </p>
      )}
    </div>
  );
}
