import { isKnockoutPhase } from '@/lib/match-phases';

/** Alinhado a `bolao-copa-api/.../scoring.ts` (EXACT_SCORE grupo vs mata-mata). */
const POINTS_EXACT_GROUP = 10;
const POINTS_EXACT_KNOCKOUT = 15;

/** Borda do card por resultado (após pontuação calculada). */
export function matchCardBorderClass(
  points: number | null | undefined,
  phase: string
): string {
  if (points == null) return '';
  if (points === 0) return 'border-2 border-red-600';
  const exact = isKnockoutPhase(phase)
    ? points === POINTS_EXACT_KNOCKOUT
    : points === POINTS_EXACT_GROUP;
  if (exact) return 'border-2 border-green-700';
  return '';
}

export function formatMatchDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Mesmo dia civil no fuso do navegador (ex.: «hoje» na página inicial). */
export function isSameLocalCalendarDay(
  dateStr: string,
  ref: Date = new Date()
): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function formatLocalDateLong(ref: Date = new Date()): string {
  return ref.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Chave `YYYY-MM-DD` no calendário local (ordenável) para agrupar partidas por dia. */
export function localCalendarDayKey(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
