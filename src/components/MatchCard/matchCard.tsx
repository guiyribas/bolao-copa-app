'use client';

import { useState } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { MatchCardProps } from './matchCard.types';
import { formatMatchDate, matchCardBorderClass } from './matchCard.utils';
import * as styles from './matchCard.styles';
import { TeamWithFlag } from '@/components/TeamWithFlag/teamWithFlag';
import { LiveBroadcastDot } from '@/components/LiveBroadcastDot/liveBroadcastDot';
import { matchDetailTextLinkClass } from '@/components/FixtureMatchRow/fixtureMatchRow.styles';
import { areMatchOpponentsDefined } from '@/lib/match-opponents';
import {
  getEffectiveMatchStatus,
  resolveDisplayScores,
} from '@/lib/match-display';
import { useDisplayNow } from '@/hooks/useDisplayNow';
import { selecaoPath } from '@/lib/navigation';

export function MatchCard({
  match,
  bet,
  onSave,
  readOnly,
  detailHref,
  displayNow,
}: MatchCardProps) {
  const now = useDisplayNow([match], displayNow);
  const isPast = new Date(match.date) <= new Date();
  const isFinished = match.status === 'finished';
  const isLive = getEffectiveMatchStatus(match, now) === 'live';
  const finishedDisplayScores = isFinished
    ? resolveDisplayScores(match, now)
    : null;
  /** Edição só em partidas futuras / não encerradas, com permissão explícita. */
  const canShowEditor = !readOnly && !isPast && !isFinished;
  const opponentsDefined = areMatchOpponentsDefined(match);
  /** Mata-mata (ou inconsistência nos dados): partida existe mas vagas dos times não. */
  const bettingLocked = canShowEditor && !opponentsDefined;
  /** Pode persistir placar apenas com adversários já definidos e fora da janela bloqueada. */
  const canSaveBet = canShowEditor && !bettingLocked;
  const [home, setHome] = useState<string>(bet?.homeScore?.toString() ?? '');
  const [away, setAway] = useState<string>(bet?.awayScore?.toString() ?? '');
  const [saving, setSaving] = useState(false);

  const hasBet = bet != null;
  const isDirty =
    home !== (bet?.homeScore?.toString() ?? '') ||
    away !== (bet?.awayScore?.toString() ?? '');

  async function handleSave() {
    if (!canSaveBet || home === '' || away === '' || !onSave) return;
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

  const matchLineInner = (
    <>
      <div className={styles.teamColHome}>
        {homeTeam ? (
          <TeamWithFlag
            team={homeTeam}
            nameClassName={twMerge(styles.teamName, 'text-right')}
            href={
              homeTeam.documentId ? selecaoPath(homeTeam.documentId) : undefined
            }
          />
        ) : (
          <span className={styles.teamName}>???</span>
        )}
      </div>

      {!canShowEditor ? (
        <div className={twMerge(styles.scoreCluster, 'font-mono')}>
          <span className={styles.scoreDisplay}>{bet?.homeScore ?? '-'}</span>
          <span>x</span>
          <span className={styles.scoreDisplay}>{bet?.awayScore ?? '-'}</span>
        </div>
      ) : (
        <div className={styles.scoreCluster}>
          <input
            type="number"
            min={0}
            value={home}
            disabled={bettingLocked}
            onChange={(e) => setHome(e.target.value)}
            className={twMerge(
              styles.scoreInput,
              bettingLocked &&
                'cursor-not-allowed bg-neutral-100 text-neutral-500 opacity-80'
            )}
            aria-disabled={bettingLocked}
          />
          <span className={bettingLocked ? 'text-neutral-400' : ''}>x</span>
          <input
            type="number"
            min={0}
            value={away}
            disabled={bettingLocked}
            onChange={(e) => setAway(e.target.value)}
            className={twMerge(
              styles.scoreInput,
              bettingLocked &&
                'cursor-not-allowed bg-neutral-100 text-neutral-500 opacity-80'
            )}
            aria-disabled={bettingLocked}
          />
        </div>
      )}

      <div className={styles.teamColAway}>
        {awayTeam ? (
          <TeamWithFlag
            team={awayTeam}
            nameClassName={styles.teamName}
            href={
              awayTeam.documentId ? selecaoPath(awayTeam.documentId) : undefined
            }
          />
        ) : (
          <span className={styles.teamName}>???</span>
        )}
      </div>
    </>
  );

  const matchLineEl = (
    <div className={twMerge(styles.matchLine, 'min-w-0 flex-1')}>{matchLineInner}</div>
  );

  return (
    <div
      className={twMerge(
        styles.card,
        outcomeBorder,
        isLive && styles.cardLive,
        bettingLocked &&
          'bg-neutral-50/90 opacity-[0.88] saturate-[0.92] shadow-none'
      )}
    >
      {isLive ? <LiveBroadcastDot /> : null}
      <div className={styles.mainRow}>
        {matchLineEl}

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          {canShowEditor ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={
                bettingLocked ||
                saving ||
                home === '' ||
                away === '' ||
                (hasBet && !isDirty)
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
                  <span className="inline-flex items-center gap-0.5">
                    Salvo
                    <CheckIcon
                      className="h-2.5 w-2.5 shrink-0 text-current"
                      fontSize="inherit"
                      aria-hidden
                    />
                  </span>
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
      </div>

      <div
        className={twMerge(
          styles.metaBlock,
          detailHref ? styles.metaBlockSplit : styles.metaBlockCentered
        )}
      >
        <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
          <span className={styles.dateLabel}>
            {formatMatchDate(match.date)}
          </span>
          {bettingLocked && (
            <>
              <span className={styles.metaSeparator} aria-hidden>
                ·
              </span>
              <span className="text-xs font-medium text-amber-900/85">
                Adversários a definir
              </span>
            </>
          )}
          {isFinished && (
            <>
              <span className={styles.metaSeparator} aria-hidden>
                ·
              </span>
              <span className={styles.resultInfo}>
                {finishedDisplayScores
                  ? `${finishedDisplayScores.home} x ${finishedDisplayScores.away}`
                  : '- x -'}
              </span>
            </>
          )}
        </span>
        {detailHref ? (
          <Link
            href={detailHref}
            className={matchDetailTextLinkClass}
            aria-label="Ver palpites para a partida"
          >
            Ver palpites para a partida
            <ChevronRightIcon className="size-3.5 opacity-80" aria-hidden />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
