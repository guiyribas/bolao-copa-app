import type { GroupTableProps } from './groupTable.types';
import * as styles from './groupTable.styles';
import { selecaoPath } from '@/lib/navigation';
import { StandingWithFlag } from '@/components/TeamWithFlag/teamWithFlag';

export function GroupTable({ group, standings }: GroupTableProps) {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Grupo {group}</h3>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.cellPos}>#</th>
            <th className="py-1">Seleção</th>
            <th className={styles.cellCenter}>Pts</th>
            <th className={styles.cellCenter}>J</th>
            <th className={styles.cellCenter}>V</th>
            <th className={styles.cellCenter}>E</th>
            <th className={styles.cellCenter}>D</th>
            <th className={styles.cellCenter}>GM</th>
            <th className={styles.cellCenter}>GC</th>
            <th className={styles.cellCenter}>SG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => (
            <tr key={team.teamId} className={styles.row}>
              <td className={styles.cellPos}>{i + 1}</td>
              <td className={styles.cellTeam}>
                <StandingWithFlag
                  code={team.teamCode}
                  name={team.teamName || team.teamCode}
                  flagUrl={team.flagUrl}
                  href={team.teamId ? selecaoPath(team.teamId) : undefined}
                />
              </td>
              <td className={styles.cellPoints}>{team.points}</td>
              <td className={styles.cellCenter}>{team.played}</td>
              <td className={styles.cellCenter}>{team.wins}</td>
              <td className={styles.cellCenter}>{team.draws}</td>
              <td className={styles.cellCenter}>{team.losses}</td>
              <td className={styles.cellCenter}>{team.goalsFor}</td>
              <td className={styles.cellCenter}>{team.goalsAgainst}</td>
              <td className={styles.cellCenter}>{team.goalDifference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
