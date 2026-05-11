import type { Metadata } from 'next';
import { SITE_BRAND_LOGO_PATH, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site-brand';
import { getSiteUrl } from '@/lib/site-url';

type PageMetadataOptions = {
  description?: string;
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
};

export function pageMetadata(
  title: string,
  options: PageMetadataOptions = {}
): Metadata {
  const metadata: Metadata = { title };

  if (options.description) {
    metadata.description = options.description;
  }

  if (options.openGraph) {
    metadata.openGraph = options.openGraph;
  }

  if (options.twitter) {
    metadata.twitter = options.twitter;
  }

  return metadata;
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: SITE_BRAND_LOGO_PATH,
    apple: SITE_BRAND_LOGO_PATH,
  },
};
