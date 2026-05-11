import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';
import { MatchCard } from '@/components/MatchCard/matchCard';
import { matchesListPath } from '@/lib/matches-query';
import { normalizeBetsPayload, normalizeMatchesPayload } from '@/lib/match-status';
import { pageMetadata } from '@/lib/site-metadata';
import {
  buildTeamFlagLookup,
  enrichBetsWithTeamFlagLookup,
} from '@/lib/team-flag-lookup';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

type PageProps = { params: Promise<{ username: string }> };

export async function generateMetadata({
  params,
}: Pick<PageProps, 'params'>): Promise<Metadata> {
  const { username } = await params;
  const displayName = decodeURIComponent(username).trim() || 'Perfil público';
  return pageMetadata(`Perfil público — ${displayName}`);
}

function LoadError({ kind, status }: { kind: 'network' | 'http'; status?: number }) {
  return (
    <div className="max-w-3xl px-3 py-8">
      <PageBreadcrumb label="Perfil público" className="mb-4" />
      <p className="text-sm text-red-600" role="alert">
        {kind === 'network'
          ? 'Não foi possível carregar este perfil.'
          : `Não foi possível carregar este perfil (${status ?? '?'}).`}
      </p>
    </div>
  );
}

export default async function UserPublicProfilePage({ params }: PageProps) {
  const { username: usernameParam } = await params;
  const usernameSegment = decodeURIComponent(usernameParam);

  const betsUrl = `${API_URL}/api/bets/by-username/${encodeURIComponent(usernameSegment)}/public`;
  const matchesUrl = `${API_URL}${matchesListPath(undefined)}`;

  const [betsOutcome, matchesOutcome] = await Promise.allSettled([
    fetch(betsUrl, { next: { revalidate: 30 } }),
    fetch(matchesUrl, { next: { revalidate: 120 } }),
  ]);

  if (betsOutcome.status !== 'fulfilled') {
    return <LoadError kind="network" />;
  }

  const res = betsOutcome.value;

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    return <LoadError kind="http" status={res.status} />;
  }

  let body: { data?: { bets?: unknown[]; username?: string } };
  try {
    body = (await res.json()) as { data?: { bets?: unknown[]; username?: string } };
  } catch {
    return <LoadError kind="network" />;
  }

  const displayName = body.data?.username ?? usernameSegment;
  let bets = normalizeBetsPayload({ data: body.data?.bets ?? [] });

  if (matchesOutcome.status === 'fulfilled' && matchesOutcome.value.ok) {
    try {
      const matchesRaw = await matchesOutcome.value.json();
      const matches = normalizeMatchesPayload(matchesRaw);
      const lookup = buildTeamFlagLookup(matches);
      bets = enrichBetsWithTeamFlagLookup(bets, lookup);
    } catch {
      /* mantém palpites só com o que veio do endpoint de apostas */
    }
  }

  const sorted = [...bets].sort(
    (a, b) =>
      new Date(a.match.date).getTime() - new Date(b.match.date).getTime()
  );

  return (
    <div className="max-w-3xl px-3 py-8">
      <PageBreadcrumb label="Perfil público" className="mb-4" />

      <h1 className="text-lg font-bold mb-1">
        Perfil público
        <span className="font-semibold text-neutral-800"> — {displayName}</span>
      </h1>
      <p className="text-sm text-neutral-600 mb-6 max-w-prose leading-relaxed">
        Palpites visíveis apenas para partidas ao vivo ou já finalizadas. Jogos
        ainda não iniciados não aparecem aqui.
      </p>

      {sorted.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nenhum palpite visível no momento (nenhuma partida deste jogador está ao
          vivo ou finalizada).
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((bet) => (
            <MatchCard
              key={`${bet.documentId}-${bet.match.documentId}`}
              match={bet.match}
              bet={bet}
              readOnly
            />
          ))}
        </div>
      )}
    </div>
  );
}
