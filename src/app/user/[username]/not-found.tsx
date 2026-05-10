import { PageBreadcrumb } from '@/components/PageBreadcrumb/pageBreadcrumb';

export default function UserProfileNotFound() {
  return (
    <div className="max-w-3xl px-3 py-8">
      <PageBreadcrumb
        label="Utilizador não encontrado"
        className="mb-4"
      />
      <h1 className="text-lg font-bold mb-2">Utilizador não encontrado</h1>
      <p className="text-sm text-neutral-600 mb-4">
        Não existe palpiteiro com este nome de utilizador.
      </p>
    </div>
  );
}
