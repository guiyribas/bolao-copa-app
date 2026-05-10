'use client';

import Image from 'next/image';
import type { Team } from '@/types';
import { absoluteStrapiMediaUrl, resolveTeamFlagUrl } from '@/lib/strapi-media';
import * as styles from './teamWithFlag.styles';
import { twMerge } from 'tailwind-merge';

export type TeamWithFlagProps = {
  team: Team;
  className?: string;
  nameClassName?: string;
};

export function TeamWithFlag({ team, className, nameClassName }: TeamWithFlagProps) {
  const code = team.code || '???';
  const name = team.name || code;
  const src = resolveTeamFlagUrl(team);

  return (
    <span className={twMerge(styles.row, className)} title={name}>
      {src ? (
        <Image
          src={src}
          alt=""
          width={22}
          height={16}
          className={styles.flagImg}
          unoptimized
        />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden>
          {code.slice(0, 2)}
        </span>
      )}
      <span className={twMerge(styles.name, nameClassName)}>
        <span className="sm:hidden">{code}</span>
        <span className="hidden sm:inline">{name}</span>
      </span>
    </span>
  );
}

export type StandingWithFlagProps = {
  code: string;
  name: string;
  flagUrl?: string | null;
  className?: string;
  nameClassName?: string;
};

/** Linha da tabela de classificação (code/nome vindos da simulação ou do placar real). */
export function StandingWithFlag({
  code,
  name,
  flagUrl,
  className,
  nameClassName,
}: StandingWithFlagProps) {
  const src = flagUrl?.trim() ? absoluteStrapiMediaUrl(flagUrl.trim()) : null;

  return (
    <span className={twMerge(styles.row, className)} title={name}>
      {src ? (
        <Image
          src={src}
          alt=""
          width={22}
          height={16}
          className={styles.flagImg}
          unoptimized
        />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden>
          {(code || '??').slice(0, 2)}
        </span>
      )}
      <span className={twMerge(styles.name, nameClassName)}>
        <span className="sm:hidden">{code.trim() ? code : name.slice(0, 3)}</span>
        <span className="hidden sm:inline">{name}</span>
      </span>
    </span>
  );
}
