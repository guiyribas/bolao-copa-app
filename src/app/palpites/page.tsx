import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import PalpitesPage from './palpites-page';

export const metadata = pageMetadata('Palpites');

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <PalpitesPage />
    </Suspense>
  );
}
