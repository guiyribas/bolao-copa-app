'use client';

import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '@mui/icons-material/Check';
import type { MatchCardProps } from './matchCard.types';
import { formatMatchDate, matchCardBorderClass } from './matchCard.utils';
import * as styles from './matchCard.styles';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { LiveBroadcastDot } from '@/components/LiveBroadcastDot/liveBroadcastDot';

export function MatchCard({ match, bet, onSave, readOnly }: MatchCardProps) {
  const isPast = new Date(match.date) <= new Date();
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  /** Bloqueia se o horário da partida já passou ou se o jogo foi finalizado. */
  const canUpdateScore = !readOnly && !isPast && !isFinished;
  const [home, setHome] = useState<string>(bet?.homeScore?.toString() ?? '');
  const [away, setAway] = useState<string>(bet?.awayScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const hasBet = bet != null;
  const isDirty =
    home !== (bet?.homeScore?.toString() ?? '') ||
    away !== (bet?.awayScore?.toString() ?? '');

  async function handleSave() {
    if (!canUpdateScore || home === '' || away === '' || !onSave) return;
    setSaving(true);
    try {
      await onSave(Number(home), Number(away));
    } finally {
      setSaving(false);
    }
  }

  const homeTeam = match.homeTeam;
  const awayTeam = match.awayTeam;

  const outcomeBorder = matchCardBorderClass(bet?.points ?? null, match.phase);

  return (
    <div
      className={twMerge(styles.card, outcomeBorder, isLive && styles.cardLive)}
    >
      {isLive ? <LiveBroadcastDot /> : null}
      <div className={styles.mainRow}>
        <div className={styles.matchLine}>
          <div className={styles.teamColHome}>
            {homeTeam ? (
              <TeamWithFlag
                team={homeTeam}
                nameClassName={twMerge(styles.teamName, 'text-right')}
              />
            ) : (
              <span className={styles.teamName}>???</span>
            )}
          </div>

          {!canUpdateScore ? (
            <div className={twMerge(styles.scoreCluster, 'font-mono')}>
              <span className={styles.scoreDisplay}>
                {bet?.homeScore ?? '-'}
              </span>
              <span>x</span>
              <span className={styles.scoreDisplay}>
                {bet?.awayScore ?? '-'}
              </span>
            </div>
          ) : (
            <div className={styles.scoreCluster}>
              <input
                type="number"
                min={0}
                value={home}
                onChange={(e) => setHome(e.target.value)}
                className={styles.scoreInput}
              />
              <span>x</span>
              <input
                type="number"
                min={0}
                value={away}
                onChange={(e) => setAway(e.target.value)}
                className={styles.scoreInput}
              />
            </div>
          )}

          <div className={styles.teamColAway}>
            {awayTeam ? (
              <TeamWithFlag team={awayTeam} nameClassName={styles.teamName} />
            ) : (
              <span className={styles.teamName}>???</span>
            )}
          </div>
        </div>

        {canUpdateScore ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving || home === '' || away === '' || (hasBet && !isDirty)
            }
            aria-busy={saving}
            className={
              hasBet && !isDirty ? styles.saveBtnSaved : styles.saveBtn
            }
          >
            <span className={styles.saveBtnInner}>
              {saving ? (
                <span
                  className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden
                />
              ) : hasBet && !isDirty ? (
                <>
                  Salvo
                  <CheckIcon className="size-4 shrink-0" aria-hidden />
                </>
              ) : hasBet ? (
                'Atualizar'
              ) : (
                'Salvar'
              )}
            </span>
          </button>
        ) : bet?.points != null ? (
          <div
            className={styles.inlinePoints}
            aria-label={`Pontos nesta partida: ${bet.points}`}
          >
            <span className={styles.pointsLabel}>Pts:</span>
            <span
              className={
                bet.points === 0 ? styles.pointsValueZero : styles.pointsValue
              }
            >
              {bet.points === 0 ? '0' : `+${bet.points}`}
            </span>
          </div>
        ) : null}
      </div>

      <div className={styles.metaBlock}>
        <span className={styles.dateLabel}>{formatMatchDate(match.date)}</span>
        {isFinished && (
          <>
            <span className={styles.metaSeparator} aria-hidden>
              ·
            </span>
            <span className={styles.resultInfo}>
              {match.homeScore ?? '-'} x {match.awayScore ?? '-'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
