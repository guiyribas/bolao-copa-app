import { pageMetadata } from '@/lib/site-metadata';
import { SobreForm } from './sobre-form';

export const metadata = pageMetadata('Sobre', {
  description:
    'Sobre o projeto (código aberto), apoio opcional e como solicitar a criação de um novo bolão.',
});

export default function SobrePage() {
  return <SobreForm />;
}
