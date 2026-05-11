import { Suspense } from 'react';
import PalpitesPage from './palpites-page';

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <PalpitesPage />
    </Suspense>
  );
}
