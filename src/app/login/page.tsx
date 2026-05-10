import { Suspense } from 'react';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mt-16 text-center">Carregando...</p>}>
      <LoginForm />
    </Suspense>
  );
}
