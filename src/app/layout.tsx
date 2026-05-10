import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Header } from '@/components/Header/header';
import { AppToaster } from '@/components/AppToaster/app-toaster';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bolão Copa 2026',
  description: 'Bolão da Copa do Mundo 2026',
};

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
          <main className="w-full max-w-237.5 mx-auto px-4 py-6 flex-1">
            {children}
          </main>
          <AppToaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
