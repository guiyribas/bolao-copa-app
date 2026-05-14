'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { ApiError, apiFetch } from '@/lib/api';
import { CRIAR_BOLOAO_PATH } from '@/lib/navigation';
import {
  POOL_ADMIN_PAYMENT_ADMIN_FIELDSET_INTRO,
  POOL_ADMIN_PAYMENT_CALLOUT,
} from '@/lib/site-brand';
import { useAuthStore } from '@/stores/auth-store';

const inputClass =
  'w-full border border-neutral-300 rounded px-3 py-2 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-emerald-600';
const disabledInputClass =
  'w-full border border-neutral-200 rounded px-3 py-2 text-sm text-neutral-700 bg-neutral-50 cursor-not-allowed';
const labelClass = 'block text-xs font-medium text-neutral-700 mb-1';
const paymentNoticeClass =
  'mb-8 max-w-xl rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900';

export function CriarBolaoForm() {
  const router = useRouter();
  const { jwt, user, hasHydrated } = useAuthStore();
  const [poolName, setPoolName] = useState('');
  const [poolDescription, setPoolDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const adminName = user?.username?.trim() ?? '';
  const adminEmail = user?.email?.trim() ?? '';
  const hasAdminIdentity = Boolean(adminName && adminEmail);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!jwt) {
      router.replace(
        `/login?returnUrl=${encodeURIComponent(CRIAR_BOLOAO_PATH)}`
      );
    }
  }, [hasHydrated, jwt, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasAdminIdentity) return;
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await apiFetch<{ data: { ok?: boolean } }>(
        '/api/pool-leads/submit',
        {
          method: 'POST',
          body: JSON.stringify({
            poolName: poolName.trim(),
            poolDescription: poolDescription.trim(),
            adminName,
            adminEmail,
          }),
        },
        null
      );
      setSuccess(true);
      setPoolName('');
      setPoolDescription('');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Não foi possível enviar. Tente de novo mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated) {
    return <p className="mt-16 text-center text-sm text-neutral-600">Carregando...</p>;
  }

  if (!jwt) {
    return (
      <p className="mt-16 text-center text-sm text-neutral-600">
        Redirecionando para o login...
      </p>
    );
  }

  return (
    <div className="max-w-3xl pb-16">
      <PageBreadcrumb label="Criar bolão" className="mb-3" />
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Criar bolão</h1>
      <p className="text-sm text-neutral-600 mb-8">
        Envie os dados do bolão que você quer organizar. O pedido fica vinculado
        à sua conta e usamos o e-mail dela para acompanhar a criação.
      </p>

      {!success ? (
        <aside
          role="note"
          aria-label="Responsabilidade do administrador sobre pagamentos"
          className={paymentNoticeClass}
        >
          {POOL_ADMIN_PAYMENT_CALLOUT}
        </aside>
      ) : null}

      {success ? (
        <div
          role="status"
          className="max-w-xl rounded-xl border-2 border-emerald-400 bg-emerald-50 px-6 py-8 shadow-sm ring-1 ring-emerald-200/80"
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <span
              className="material-symbols-outlined shrink-0 text-5xl text-emerald-600"
              aria-hidden
            >
              check_circle
            </span>
            <div className="min-w-0 space-y-2">
              <p className="text-lg font-bold text-emerald-950">
                Pedido enviado com sucesso
              </p>
              <p className="text-sm leading-relaxed text-emerald-900">
                Registramos a solicitação com os dados da sua conta. Fique atento
                ao <strong>e-mail</strong> {adminEmail} — avisaremos quando o
                bolão estiver criado ou se precisarmos de mais alguma informação.
              </p>
            </div>
          </div>
        </div>
      ) : !hasAdminIdentity ? (
        <p className="text-sm text-neutral-700" role="alert">
          Não foi possível carregar nome e e-mail da sua conta. Tente sair e
          entrar de novo.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Dados do bolão
            </legend>
            <div>
              <label htmlFor="poolName" className={labelClass}>
                Nome do bolão <span className="text-red-600">*</span>
              </label>
              <input
                id="poolName"
                name="poolName"
                type="text"
                required
                maxLength={200}
                value={poolName}
                onChange={(e) => setPoolName(e.target.value)}
                className={inputClass}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="poolDescription" className={labelClass}>
                Descrição
              </label>
              <textarea
                id="poolDescription"
                name="poolDescription"
                rows={3}
                value={poolDescription}
                onChange={(e) => setPoolDescription(e.target.value)}
                className={inputClass}
                placeholder="Ex.: bolão da firma, prêmios, regras internas…"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Admin do bolão
            </legend>
            <p className="text-xs text-neutral-500">
              {POOL_ADMIN_PAYMENT_ADMIN_FIELDSET_INTRO}
            </p>
            <div>
              <label htmlFor="adminName" className={labelClass}>
                Nome <span className="text-red-600">*</span>
              </label>
              <input
                id="adminName"
                name="adminName"
                type="text"
                required
                readOnly
                disabled
                aria-readonly="true"
                maxLength={200}
                value={adminName}
                className={disabledInputClass}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="adminEmail" className={labelClass}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                required
                readOnly
                disabled
                aria-readonly="true"
                maxLength={254}
                value={adminEmail}
                className={disabledInputClass}
                autoComplete="email"
              />
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? 'A enviar…' : 'Enviar pedido'}
          </button>
        </form>
      )}
    </div>
  );
}
