import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_BRAND_LOGO_PATH, SITE_NAME } from '@/lib/site-brand';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logoBuffer = await readFile(
    join(process.cwd(), 'public', SITE_BRAND_LOGO_PATH.replace(/^\//, ''))
  );
  const logoSrc = `data:image/avif;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, #f8fafc 0%, #ffffff 45%, #ecfdf5 100%)',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          <img
            src={logoSrc}
            alt=""
            width={520}
            height={144}
            style={{ objectFit: 'contain' }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 56,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            {SITE_NAME}
          </p>
        </div>
      </div>
    ),
    size
  );
}
