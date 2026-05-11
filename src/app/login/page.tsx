import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import { LoginForm } from './login-form';

export const metadata = pageMetadata('Entrar');

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <LoginForm />
    </Suspense>
  );
}
