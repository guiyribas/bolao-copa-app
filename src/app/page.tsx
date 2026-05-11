import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import HomePage from './home-page';

export const metadata = pageMetadata('Partidas e resultados');

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <HomePage />
    </Suspense>
  );
}
