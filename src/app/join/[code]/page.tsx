import { redirect } from 'next/navigation';

/** Compat: links antigos /join/[code] → /invite/[inviteCode]. */
export default async function LegacyJoinRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/invite/${encodeURIComponent(code)}`);
}
