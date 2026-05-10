import type { NextConfig } from 'next';

const apiUrl =
  typeof process.env.NEXT_PUBLIC_API_URL === 'string'
    ? process.env.NEXT_PUBLIC_API_URL
    : '';
let apiHost: string | undefined;
try {
  apiHost = apiUrl ? new URL(apiUrl).hostname : undefined;
} catch {
  apiHost = undefined;
}

/** Bandeiras e uploads vêm do Strapi (mesmo host que `NEXT_PUBLIC_API_URL`). */
const strapiRemotePatterns =
  apiHost != null && apiHost !== ''
    ? [
        {
          protocol: (apiUrl.startsWith('https') ? 'https' : 'http') as 'http' | 'https',
          hostname: apiHost,
          pathname: '/**',
        },
      ]
    : [
        {
          protocol: 'http' as const,
          hostname: 'localhost',
          port: '1337',
          pathname: '/**',
        },
      ];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: strapiRemotePatterns,
  },
};

export default nextConfig;
