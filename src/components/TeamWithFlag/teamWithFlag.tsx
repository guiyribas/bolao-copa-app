'use client';

import Link from 'next/link';
import type { Team } from '@/types';
import { absoluteStrapiMediaUrl, resolveTeamFlagUrl } from '@/lib/strapi-media';
import { TeamFlagImage } from '@/components/TeamWithFlag/teamFlagImage';
import * as styles from './teamWithFlag.styles';
import { twMerge } from 'tailwind-merge';

export type TeamWithFlagProps = {
  team: Team;
  className?: string;
  nameClassName?: string;
  href?: string;
};

export function TeamWithFlag({
  team,
  className,
  nameClassName,
  href,
}: TeamWithFlagProps) {
  const code = team.code || '???';
  const name = team.name || code;
  const src = resolveTeamFlagUrl(team);

  const content = (
    <>
      {src ? (
        <TeamFlagImage src={src} size="sm" />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden>
          {code.slice(0, 2)}
        </span>
      )}
      <span className={twMerge(styles.name, nameClassName)}>
        <span className="sm:hidden">{code}</span>
        <span className="hidden sm:inline">{name}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={twMerge(styles.row, styles.link, className)}
        title={name}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={twMerge(styles.row, className)} title={name}>
      {content}
    </span>
  );
}

export type StandingWithFlagProps = {
  code: string;
  name: string;
  flagUrl?: string | null;
  className?: string;
  nameClassName?: string;
  href?: string;
};

/** Linha da tabela de classificação (code/nome vindos da simulação ou do placar real). */
export function StandingWithFlag({
  code,
  name,
  flagUrl,
  className,
  nameClassName,
  href,
}: StandingWithFlagProps) {
  const src = flagUrl?.trim() ? absoluteStrapiMediaUrl(flagUrl.trim()) : null;

  const content = (
    <>
      {src ? (
        <TeamFlagImage src={src} size="sm" />
      ) : (
        <span className={styles.flagPlaceholder} aria-hidden>
          {(code || '??').slice(0, 2)}
        </span>
      )}
      <span className={twMerge(styles.name, nameClassName)}>
        <span className="sm:hidden">{code.trim() ? code : name.slice(0, 3)}</span>
        <span className="hidden sm:inline">{name}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={twMerge(styles.row, styles.link, className)}
        title={name}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={twMerge(styles.row, className)} title={name}>
      {content}
    </span>
  );
}
