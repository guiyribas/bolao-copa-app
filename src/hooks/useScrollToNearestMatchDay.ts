import { useEffect } from 'react';
import { pickNearestMatchDayKey } from '@/components/MatchCard/matchCard.utils';

type UseScrollToNearestMatchDayOptions = {
  dayKeys: string[];
  enabled: boolean;
  getAnchorId: (dayKey: string) => string;
};

export function useScrollToNearestMatchDay({
  dayKeys,
  enabled,
  getAnchorId,
}: UseScrollToNearestMatchDayOptions) {
  const dayKeysKey = dayKeys.join('|');

  useEffect(() => {
    if (!enabled || dayKeys.length === 0) return;

    const targetDayKey = pickNearestMatchDayKey(dayKeys);
    if (!targetDayKey) return;

    const anchorId = getAnchorId(targetDayKey);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(anchorId)?.scrollIntoView({
        behavior,
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [dayKeysKey, enabled, getAnchorId]);
}
