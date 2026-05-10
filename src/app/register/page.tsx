import { Suspense } from 'react';
import { RegisterForm } from './register-form';

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <RegisterForm />
    </Suspense>
  );
}
