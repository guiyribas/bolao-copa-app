import type { RankingTableProps } from './rankingTable.types';
import * as styles from './rankingTable.styles';

function pointsCellValue(n: number | null | undefined): string {
  if (n == null || Number.isNaN(Number(n))) return '-';
  return String(n);
}

export function RankingTable({ ranking }: RankingTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.headerRow}>
          <th className="py-2 w-10 align-bottom">#</th>
          <th className="py-2 align-bottom">Palpiteiro</th>
          <th className={styles.pointsSubHeader}>Grupos</th>
          <th className={styles.pointsSubHeader}>Mata-mata</th>
          <th className={`${styles.pointsSubHeader} font-semibold text-neutral-700`}>Total</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((entry, i) => (
          <tr key={entry.userId} className={styles.row}>
            <td className={styles.posCell}>{i + 1}</td>
            <td className={styles.nameCell}>{entry.username}</td>
            <td className={styles.pointsCell}>{pointsCellValue(entry.pointsGroupPhase)}</td>
            <td className={styles.pointsCell}>{pointsCellValue(entry.pointsKnockout)}</td>
            <td className={styles.pointsCellStrong}>{entry.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
