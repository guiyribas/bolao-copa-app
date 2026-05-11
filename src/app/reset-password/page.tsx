import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import { ResetPasswordForm } from './reset-password-form';

export const metadata = pageMetadata('Redefinir senha');

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
