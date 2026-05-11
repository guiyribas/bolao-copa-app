import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_OG_LOGO_PATH } from '@/lib/site-brand';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const OG_FONT_PATH = join(process.cwd(), 'public/fonts/Roboto-Bold.woff');

export default async function OpenGraphImage() {
  const [logoBuffer, fontData] = await Promise.all([
    readFile(join(process.cwd(), 'public', SITE_OG_LOGO_PATH.replace(/^\//, ''))),
    readFile(OG_FONT_PATH),
  ]);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

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
          backgroundColor: '#f8fafc',
          padding: 64,
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
            marginTop: 32,
            marginBottom: 0,
            fontFamily: 'Roboto',
            fontSize: 56,
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          {SITE_NAME}
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Roboto',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
