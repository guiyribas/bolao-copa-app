'use client';

import { useState } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { saveBtn } from '@/components/MatchCard/matchCard.styles';
import { SiteFifaDisclaimer } from '@/components/SiteFifaDisclaimer/siteFifaDisclaimer';
import { CRIAR_BOLOAO_PATH } from '@/lib/navigation';
import { POOL_REQUESTS_ENABLED } from '@/lib/pool-requests';
import {
  POOL_ADMIN_PAYMENT_SECTION_PARAGRAPHS,
  POOL_ADMIN_PAYMENT_SECTION_TITLE,
  POOL_ADMIN_PAYMENT_SUPPORT_CONTRAST,
} from '@/lib/site-brand';

const sectionClass = 'mb-10 last:mb-0';
const h2Class = 'text-lg font-semibold text-neutral-900 mb-2';
const proseClass = 'text-sm text-neutral-700 space-y-3 leading-relaxed';

/** Imagem em public/; override com NEXT_PUBLIC_SUPPORT_QR_URL se precisar de outro URL/caminho. */
const APOIO_QR_DEFAULT_PATH = '/qrcodecoffe.jpeg';

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

function SupportPixKeyRow({ pixKey }: { pixKey: string }) {
  const [copied, setCopied] = useState(false);

  async function copyPixKey() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-sm font-medium text-neutral-900">Chave PIX (aleatória)</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <p
          className="min-w-0 flex-1 break-all rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-700"
          title={pixKey}
        >
          {pixKey}
        </p>
        <button
          type="button"
          onClick={() => void copyPixKey()}
          className={twMerge(saveBtn, 'w-full shrink-0 hover:bg-emerald-700 sm:w-auto')}
        >
          {copied ? 'Copiado!' : 'Copiar chave'}
        </button>
      </div>
    </div>
  );
}

function SupportPixBlock() {
  const customEnv = (process.env.NEXT_PUBLIC_SUPPORT_QR_URL ?? '').trim();
  const resolved = customEnv || APOIO_QR_DEFAULT_PATH;
  const supportPixKey = (process.env.NEXT_PUBLIC_SUPPORT_PIX_KEY ?? '').trim();

  const imgClass =
    'h-44 w-44 rounded-lg border border-neutral-200 bg-white object-contain p-2 shrink-0';

  return (
    <div className="space-y-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- jpeg em public/ ou URL absoluta */}
      <img
        src={resolved}
        alt="QR PIX para apoio voluntário aos custos do projeto"
        width={176}
        height={176}
        className={imgClass}
      />
      {supportPixKey ? <SupportPixKeyRow pixKey={supportPixKey} /> : null}
    </div>
  );
}

export function SobreForm() {
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
          {POOL_REQUESTS_ENABLED ? (
            <p>
              Quem quiser organizar um grupo pode{' '}
              <Link
                href={CRIAR_BOLOAO_PATH}
                className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-2 outline-none hover:text-emerald-950 hover:decoration-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                solicitar a criação de um bolão
              </Link>
              . É preciso estar logado; sem sessão, o site pede login antes do
              formulário.
            </p>
          ) : (
            <p>
              A Copa do Mundo 2026 já começou e não estamos mais aceitando
              pedidos de criação de novos bolões nesta edição.
            </p>
          )}
          <p>
            O projeto é <strong>código aberto</strong>: o código-fonte da
            interface e da API está disponível para consulta, aprendizado ou
            sugestões.
          </p>
          <OpenSourceRepoLinks />
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="sobre-pagamentos">
        <h2 id="sobre-pagamentos" className={h2Class}>
          {POOL_ADMIN_PAYMENT_SECTION_TITLE}
        </h2>
        <div className={proseClass}>
          {POOL_ADMIN_PAYMENT_SECTION_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>{POOL_ADMIN_PAYMENT_SUPPORT_CONTRAST}</p>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="sobre-apoio">
        <h2 id="sobre-apoio" className={`${h2Class} scroll-mt-24`}>
          Apoiar os custos do projeto
        </h2>
        <div className={`${proseClass} mb-4`}>
          <p>
            O bolão é gratuito e foi feito para os brasileiros amantes de
            futebol. Por ser um serviço à comunidade, os custos de hospedagem e
            operação ficam por conta do desenvolvedor. Se quiser ajudar com as
            despesas do projeto, use o QR code ou a chave PIX abaixo, qualquer valor é bem-vindo.
          </p>
        </div>
        <SupportPixBlock />
      </section>
      <div className="mt-3">
        <SiteFifaDisclaimer />
      </div>
    </div>
  );
}
