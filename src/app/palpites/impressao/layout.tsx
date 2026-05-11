import { pageMetadata } from '@/lib/site-metadata';

export const metadata = pageMetadata('Palpites para impressão');

export default function PalpitesImpressaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
