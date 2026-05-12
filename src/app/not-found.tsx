import Image from 'next/image';
import Link from 'next/link';
import { HOME_PATH } from '@/lib/navigation';
import { pageMetadata } from '@/lib/site-metadata';

const NOT_FOUND_ILLUSTRATION_PATH = '/cr7404.png';

export const metadata = pageMetadata('Página não encontrada', {
  description:
    'A página que você tentou abrir não existe ou o link está incorreto.',
});

const primaryLinkClass =
  'inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white outline-none hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        Página não encontrada
      </h1>
      <div className="mb-6 flex justify-center">
        <Image
          src={NOT_FOUND_ILLUSTRATION_PATH}
          alt="Jogador caminhando ao lado da taça da Copa do Mundo"
          width={1254}
          height={1254}
          className="h-auto w-full max-w-md rounded-lg"
          priority
        />
      </div>
      <p className="mb-6 text-lg font-medium text-neutral-900">
        Ué, como você chegou até aqui?
      </p>
      <Link href={HOME_PATH} className={primaryLinkClass}>
        Me leve para o início!
      </Link>
    </div>
  );
}
