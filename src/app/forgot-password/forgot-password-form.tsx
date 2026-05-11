'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { forgotPassword } from '@/lib/auth';
import { HOME_PATH, safeReturnUrl } from '@/lib/navigation';

const GENERIC_SUCCESS_MESSAGE =
  'Se existir uma conta com esse e-mail, enviamos instruções para redefinir a senha.';
const GENERIC_ERROR_MESSAGE =
  'Não foi possível enviar as instruções. Tente novamente mais tarde.';

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get('returnUrl'));

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginHref =
    returnUrl !== HOME_PATH
      ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/login';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <PageBreadcrumb label="Esqueci a senha" className="mb-4" />
      <h1 className="text-xl font-bold mb-6">Esqueci a senha</h1>
      {success ? (
        <p className="text-sm">{GENERIC_SUCCESS_MESSAGE}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-3 py-2 rounded"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </button>
        </form>
      )}
      <p className="mt-4 text-sm">
        <Link href={loginHref} className="underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
