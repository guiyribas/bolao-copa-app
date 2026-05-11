import { SITE_NAME } from '@/lib/site-brand';
import {
  createSiteOgImage,
  ogImageContentType,
  ogImageSize,
} from '@/lib/og-image';

export const alt = SITE_NAME;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function OpenGraphImage() {
  return createSiteOgImage(SITE_NAME);
}
