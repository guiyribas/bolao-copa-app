import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata = pageMetadata('Esqueci a senha');

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
