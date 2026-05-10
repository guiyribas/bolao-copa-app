import type { Metadata } from 'next';
import { SobreForm } from './sobre-form';

export const metadata: Metadata = {
  title: 'Sobre · Bolão Copa 2026',
  description:
    'Sobre o projeto (código aberto), apoio opcional e pedido de criação de um novo bolão.',
};

export default function SobrePage() {
  return <SobreForm />;
}
