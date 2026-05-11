import Link from 'next/link';
import * as styles from './homePalpitesFab.styles';

export function HomePalpitesFab() {
  return (
    <Link href="/palpites" className={styles.fabLink} aria-label="Ir para meus palpites">
      Meus palpites
    </Link>
  );
}
