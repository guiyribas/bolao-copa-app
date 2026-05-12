'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleSignInButton } from '@/components/GoogleSignInButton/googleSignInButton';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { register } from '@/lib/auth';
import { HOME_PATH, safeReturnUrl } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const returnUrl = safeReturnUrl(searchParams.get('returnUrl'));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      const { user, jwt } = await register(name, email, password);
      setAuth(user, jwt);
      router.push(returnUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <PageBreadcrumb label="Criar conta" className="mb-4" />
      <h1 className="text-xl font-bold mb-6">Criar Conta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3 text-sm text-neutral-500">
        <span className="h-px flex-1 bg-neutral-200" />
        ou
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <GoogleSignInButton returnUrl={returnUrl} />
      <p className="mt-4 text-sm">
        Já tem conta?{' '}
        <Link href={loginHref} className="underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
