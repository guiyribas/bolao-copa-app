import { SITE_NAME } from '@/lib/site-brand';
import {
  createSiteOgImage,
  ogImageContentType,
  ogImageSize,
} from '@/lib/og-image';
import { fetchPoolByInviteCode } from '@/lib/pools';

export const alt = SITE_NAME;
export const size = ogImageSize;
export const contentType = ogImageContentType;

type InviteOgImageProps = {
  params: Promise<{ inviteCode: string }>;
};

export default async function InviteOpenGraphImage({
  params,
}: InviteOgImageProps) {
  const { inviteCode } = await params;
  const pool = await fetchPoolByInviteCode(inviteCode);
  return createSiteOgImage(pool?.name?.trim() || SITE_NAME);
}
