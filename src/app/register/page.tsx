import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site-metadata';
import { RegisterForm } from './register-form';

export const metadata = pageMetadata('Cadastro');

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <RegisterForm />
    </Suspense>
  );
}
