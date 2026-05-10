'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { login } from '@/lib/auth';
import { HOME_PATH, safeReturnUrl } from '@/lib/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const returnUrl = safeReturnUrl(searchParams.get('returnUrl'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registerHref =
    returnUrl !== HOME_PATH
      ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
      : '/register';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, jwt } = await login(email, password);
      setAuth(user, jwt);
      router.push(returnUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <PageBreadcrumb label="Login" className="mb-4" />
      <h1 className="text-xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          className="border px-3 py-2 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Não tem conta?{' '}
        <Link href={registerHref} className="underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
