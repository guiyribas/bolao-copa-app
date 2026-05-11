'use client';

import { useState } from 'react';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { SiteFifaDisclaimer } from '@/components/SiteFifaDisclaimer/siteFifaDisclaimer';
import { ApiError, apiFetch } from '@/lib/api';
const sectionClass = 'mb-10 last:mb-0';
const h2Class = 'text-lg font-semibold text-neutral-900 mb-2';
const proseClass = 'text-sm text-neutral-700 space-y-3 leading-relaxed';
const inputClass =
  'w-full border border-neutral-300 rounded px-3 py-2 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:border-emerald-600';
const labelClass = 'block text-xs font-medium text-neutral-700 mb-1';

const POOL_VALUE_MAX_DIGITS = 12;

/** Imagem em public/; override com NEXT_PUBLIC_SUPPORT_QR_URL se precisar de outro URL/caminho. */
const APOIO_QR_DEFAULT_PATH = '/qrcodecoffe.jpeg';

/** Dígitos interpretados como centavos (ex.: "2050" → R$ 20,50). */
function formatPoolValueBRL(digits: string): string {
  if (!digits) return '';
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents) || cents < 0) return '';
  const n = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function poolValueDigitsToNumber(digits: string): number | undefined {
  if (!digits) return undefined;
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents) || cents < 0)
    throw new Error('Informe um valor válido (≥ 0) ou deixe em branco.');
  return cents / 100;
}

function handlePoolValueRawInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, POOL_VALUE_MAX_DIGITS);
}

/** URLs dos repositórios (ex.: GitHub). Variáveis públicas — sem segredos aqui. */
function OpenSourceRepoLinks() {
  const appUrl = (process.env.NEXT_PUBLIC_REPO_APP_URL ?? '').trim();
  const apiUrl = (process.env.NEXT_PUBLIC_REPO_API_URL ?? '').trim();
  if (!appUrl && !apiUrl) return null;

  const linkClass =
    'font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 outline-none hover:text-emerald-950 hover:decoration-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';

  return (
    <ul className="list-none space-y-2 pl-0">
      {appUrl ? (
        <li>
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Repositório do APP (Next.js)
          </a>
        </li>
      ) : null}
      {apiUrl ? (
        <li>
          <a
            href={apiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Repositório da API (Strapi)
          </a>
        </li>
      ) : null}
    </ul>
  );
}

function SupportQrBlock() {
  const customEnv = (process.env.NEXT_PUBLIC_SUPPORT_QR_URL ?? '').trim();
  const resolved = customEnv || APOIO_QR_DEFAULT_PATH;

  const imgClass =
    'h-44 w-44 rounded-lg border border-neutral-200 bg-white object-contain p-2 shrink-0';

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- jpeg em public/ ou URL absoluta */}
      <img
        src={resolved}
        alt="QR PIX para apoio voluntário aos custos do projeto"
        width={176}
        height={176}
        className={imgClass}
      />
    </>
  );
}

export function SobreForm() {
  const [poolName, setPoolName] = useState('');
  const [poolDescription, setPoolDescription] = useState('');
  /** Apenas dígitos; valor em centavos na UI (máscara R$). */
  const [poolValueDigits, setPoolValueDigits] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      let pv: number | undefined;
      try {
        pv = poolValueDigitsToNumber(poolValueDigits);
      } catch (verr) {
        setError(verr instanceof Error ? verr.message : 'Valor inválido');
        setLoading(false);
        return;
      }

      await apiFetch<{ data: { ok?: boolean } }>(
        '/api/pool-leads/submit',
        {
          method: 'POST',
          body: JSON.stringify({
            poolName: poolName.trim(),
            poolDescription: poolDescription.trim(),
            ...(pv !== undefined ? { poolValue: pv } : {}),
            adminName: adminName.trim(),
            adminEmail: adminEmail.trim(),
          }),
        },
        null
      );
      setSuccess(true);
      setPoolName('');
      setPoolDescription('');
      setPoolValueDigits('');
      setAdminName('');
      setAdminEmail('');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Não foi possível enviar. Tente de novo mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl pb-16">
      <PageBreadcrumb label="Sobre" className="mb-3" />
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">
        Sobre o projeto
      </h1>
      <p className="text-sm text-neutral-600 mb-8">
        Bolão público para a Copa 2026. Partidas, palpites, bolões entre amigos
        e ranking transparente.
      </p>

      <section className={sectionClass} aria-labelledby="sobre-form">
        <h2 id="sobre-form" className={h2Class}>
          Criar um novo bolão
        </h2>

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
                  Recebemos a sua solicitação. Daqui para a frente, o próximo
                  passo é ficar atento ao <strong>email</strong> que indicou —
                  responderemos quando o bolão estiver criado ou se precisarmos
                  de mais alguma informação.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`${proseClass} mb-5`}>
              <p>
                Preencha o formulário abaixo com uma ideia do bolão que você
                quer criar e os seus dados como responsável pelo grupo.{' '}
                <strong>
                  Registramos o pedido e entramos em contato por email
                </strong>{' '}
                quando o bolão estiver pronto ou se precisarmos de algum
                esclarecimento.
              </p>
              <p>
                Enquanto isso, você segue usando o site: quem não tem bolão pode
                criar conta e entrar por convite, como nas regras.
              </p>
            </div>

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
                <div>
                  <label htmlFor="poolValue" className={labelClass}>
                    Valor por participante
                  </label>
                  <input
                    id="poolValue"
                    name="poolValue"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-describedby="poolValue-hint"
                    value={formatPoolValueBRL(poolValueDigits)}
                    onChange={(e) =>
                      setPoolValueDigits(
                        handlePoolValueRawInput(e.target.value)
                      )
                    }
                    className={`${inputClass} font-mono tabular-nums`}
                    placeholder="Opcional — ex.: cada um entra com R$ 20"
                  />
                  <p
                    id="poolValue-hint"
                    className="mt-1 text-xs text-neutral-500"
                  >
                    Digite apenas números; o valor aparece em reais (R$). Deixe
                    em branco se não couber pagamento entre participantes.
                  </p>
                </div>
              </fieldset>

              <fieldset className="space-y-3 rounded-lg border border-neutral-200 p-4">
                <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Admin do bolão
                </legend>
                <div>
                  <label htmlFor="adminName" className={labelClass}>
                    Nome <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="adminName"
                    name="adminName"
                    type="text"
                    required
                    maxLength={200}
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className={inputClass}
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
                    maxLength={254}
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className={inputClass}
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
          </>
        )}
      </section>

      <section className={sectionClass} aria-labelledby="sobre-intro">
        <h2 id="sobre-intro" className={h2Class}>
          Projeto público
        </h2>
        <div className={proseClass}>
          <p>
            Este bolão existe para facilitar organização nos grupos durante a
            Copa. A criação de um novo bolão por solicitação é{' '}
            <strong>gratuita</strong>.
          </p>
          <p>
            O projeto é <strong>código aberto</strong>: o código-fonte da
            interface e da API está disponível para consulta, aprendizado ou
            sugestões.
          </p>
          <OpenSourceRepoLinks />
          <p>
            Por ser um serviço à comunidade, os custos de hospedagem e operação
            ficam por conta do desenvolvedor. Se quiser me pagar um café para
            ajudar nas despesas do projeto via QR abaixo, qualquer quantia é
            bem-vinda (e totalmente opcional).
          </p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="sobre-apoio">
        <h2 id="sobre-apoio" className={h2Class}>
          Apoiar os custos do projeto (opcional)
        </h2>
        <div className={`${proseClass} mb-4`}>
          <p>Qualquer contribuição para manter o site no ar é bem-vinda.</p>
        </div>
        <SupportQrBlock />
      </section>
      <SiteFifaDisclaimer className="mt-3" />
    </div>
  );
}
