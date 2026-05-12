import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import { GoogleAuthRedirectForm } from '@/app/connect/google/redirect/google-auth-redirect-form';

export const metadata = pageMetadata('Login com Google');

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <GoogleAuthRedirectForm />
    </Suspense>
  );
}
