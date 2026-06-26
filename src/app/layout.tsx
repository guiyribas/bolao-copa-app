import { Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Header } from '@/components/Header/header';
import { AppToaster } from '@/components/AppToaster/app-toaster';
import { InfraSupportModal } from '@/components/InfraSupportModal/infraSupportModal';
import { SiteSupportFooter } from '@/components/SiteSupportFooter/siteSupportFooter';
import { defaultSiteMetadata, defaultSiteViewport } from '@/lib/site-metadata';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata = defaultSiteMetadata;
export const viewport = defaultSiteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NuqsAdapter>
          <Header />
          <main className="w-full max-w-237.5 mx-auto px-4 py-6 flex-1 print:max-w-none print:px-2 print:py-2">
            {children}
          </main>
          <SiteSupportFooter />
          <AppToaster />
          <InfraSupportModal />
        </NuqsAdapter>
      </body>
    </html>
  );
}
