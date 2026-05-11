import { pageMetadata } from '@/lib/site-metadata';

export const metadata = pageMetadata('Bolões');

export default function MeusBoloesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
