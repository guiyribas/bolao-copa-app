import Link from 'next/link';
import type { RankingTableProps } from './rankingTable.types';
import { isRankingEntryAdmin } from './rankingTable.utils';
import * as styles from './rankingTable.styles';

const ADMIN_BADGE_LABEL = 'Administrador do bolão';

function pointsCellValue(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return '-';
  return String(n);
}

function rowClassForRank(rank: number): string {
  if (rank === 1) return styles.rowGold;
  if (rank === 2) return styles.rowSilver;
  if (rank === 3) return styles.rowBronze;
  return styles.row;
}

function posClassForRank(rank: number): string {
  if (rank === 1) return styles.posGold;
  if (rank === 2) return styles.posSilver;
  if (rank === 3) return styles.posBronze;
  return styles.posCell;
}

function nameClassForRank(rank: number): string {
  if (rank <= 3) return styles.nameCellMedal;
  return styles.nameCell;
}

export function RankingTable({ ranking, admin, rankOffset = 0 }: RankingTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.headerRow}>
            <th className="py-3 pl-3 pr-2 w-12 align-middle">#</th>
            <th className={styles.nameSubHeader}>Participante</th>
            <th className={styles.pointsSubHeader}>Grupos</th>
            <th className={styles.pointsSubHeader}>Mata-mata</th>
            <th
              className={`${styles.pointsSubHeader} font-semibold text-neutral-700`}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((entry, i) => {
            const rank = rankOffset + i + 1;
            return (
              <tr key={entry.userId} className={rowClassForRank(rank)}>
                <td className={posClassForRank(rank)}>{rank}</td>
                <td className={nameClassForRank(rank)}>
                  <span className={styles.participantCell}>
                    <Link
                      href={`/user/${encodeURIComponent(entry.username)}`}
                      prefetch={false}
                      className="underline underline-offset-2 decoration-neutral-400 hover:decoration-neutral-900 hover:text-neutral-950"
                    >
                      {entry.username}
                    </Link>
                    {isRankingEntryAdmin(entry, admin) ? (
                      <span
                        className={styles.adminBadge}
                        title={ADMIN_BADGE_LABEL}
                        aria-label={ADMIN_BADGE_LABEL}
                      >
                        Admin
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className={styles.pointsCell}>
                  {pointsCellValue(entry.pointsGroupPhase)}
                </td>
                <td className={styles.pointsCell}>
                  {pointsCellValue(entry.pointsKnockout)}
                </td>
                <td className={styles.pointsCellStrong}>{entry.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
