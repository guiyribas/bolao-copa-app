import { pageMetadata } from '@/lib/site-metadata';
import { CriarBolaoForm } from './criar-bolao-form';

export const metadata = pageMetadata('Criar bolão', {
  description:
    'Solicite a criação de um novo bolão para a Copa 2026. É preciso estar logado.',
});

export default function CriarBolaoPage() {
  return <CriarBolaoForm />;
}
