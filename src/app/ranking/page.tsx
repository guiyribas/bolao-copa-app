import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { RankingTable } from '@/components/RankingTable/rankingTable';
import { fetchGlobalRanking } from '@/lib/global-ranking';
import { RANKING_GLOBAL_PATH } from '@/lib/navigation';
import { pageMetadata } from '@/lib/site-metadata';

export const revalidate = 300;

export const metadata: Metadata = pageMetadata('Ranking geral', {
  description:
    'Classificação geral de todos os participantes do bolão, com pontos na fase de grupos e no mata-mata.',
});

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const n = raw ? Number.parseInt(raw, 10) : 1;
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

function rankingPageHref(page: number): string {
  if (page <= 1) return RANKING_GLOBAL_PATH;
  return `${RANKING_GLOBAL_PATH}?page=${page}`;
}

export default async function GlobalRankingPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  let payload;
  try {
    payload = await fetchGlobalRanking(page);
  } catch {
    return (
      <div className="max-w-3xl px-3 py-8">
        <PageBreadcrumb label="Ranking geral" className="mb-4" />
        <p className="text-sm text-red-600" role="alert">
          Não foi possível carregar o ranking geral.
        </p>
      </div>
    );
  }

  const ranking = payload.data ?? [];
  const meta = payload.meta;
  const pageCount = meta?.pageCount ?? 0;
  const total = meta?.total ?? ranking.length;
  const currentPage = meta?.page ?? page;

  return (
    <div className="max-w-3xl">
      <PageBreadcrumb label="Ranking geral" className="mb-3" />
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Ranking geral</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Classificação geral de todos os participantes com palpites registrados.
        {total > 0 ? ` ${total} participante${total === 1 ? '' : 's'}.` : ''}
      </p>

      {ranking.length === 0 ? (
        <p className="text-gray-500">Nenhum palpite computado ainda.</p>
      ) : (
        <>
          <RankingTable ranking={ranking} />
          {pageCount > 1 ? (
            <nav
              className="mt-6 flex items-center justify-between gap-4 text-sm"
              aria-label="Paginação do ranking"
            >
              {currentPage > 1 ? (
                <Link
                  href={rankingPageHref(currentPage - 1)}
                  className="underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-900"
                >
                  Página anterior
                </Link>
              ) : (
                <span className="text-neutral-400">Página anterior</span>
              )}
              <span className="text-neutral-600">
                Página {currentPage} de {pageCount}
              </span>
              {currentPage < pageCount ? (
                <Link
                  href={rankingPageHref(currentPage + 1)}
                  className="underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-900"
                >
                  Próxima página
                </Link>
              ) : (
                <span className="text-neutral-400">Próxima página</span>
              )}
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
