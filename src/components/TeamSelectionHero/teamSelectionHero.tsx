'use client';

import { TeamFlagImage } from '@/components/TeamWithFlag/teamFlagImage';
import { resolveTeamFlagUrl } from '@/lib/strapi-media';
import type { TeamSelectionHeroProps } from './teamSelectionHero.types';
import * as styles from './teamSelectionHero.styles';

export function TeamSelectionHero({ team, fifaRanking }: TeamSelectionHeroProps) {
  const code = team.code?.trim() || '???';
  const name = team.name?.trim() || code;
  const src = resolveTeamFlagUrl(team);
  const group = team.group?.trim();

  return (
    <section className={styles.section} aria-labelledby="selecao-hero-heading">
      <div className={styles.body}>
        <div className={styles.content}>
          {src ? (
            <TeamFlagImage src={src} size="lg" />
          ) : (
            <span className={styles.flagPlaceholder} aria-hidden>
              {code.slice(0, 2)}
            </span>
          )}

          <div className="min-w-0">
            <p className={styles.code}>{code}</p>
            <h1 id="selecao-hero-heading" className={styles.title}>
              {name}
            </h1>
            <div className={styles.metaRow}>
              {group ? (
                <span className={styles.chip}>Grupo {group}</span>
              ) : null}
              {fifaRanking != null ? (
                <span className={styles.fifaChip}>Ranking FIFA #{fifaRanking}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
