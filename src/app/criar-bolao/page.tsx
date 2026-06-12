import { pageMetadata } from '@/lib/site-metadata';
import { CriarBolaoForm } from './criar-bolao-form';

export const metadata = pageMetadata('Criar bolão', {
  description: 'A Copa do Mundo 2026 já começou!',
});

export default function CriarBolaoPage() {
  return <CriarBolaoForm />;
}
