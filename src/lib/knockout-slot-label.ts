import type { Match } from '@/types';

export const KNOCKOUT_SLOT_UNDEFINED_LABEL = 'A definir';

const MATCH_TITLE_SIDE_SEPARATOR = /\s+(?:vs\.?|x)\s+/i;

type MatchTitleSource = Pick<Match, 'title'> | null | undefined;

/** Rótulo de slot por lado quando a partida ainda não tem seleção vinculada. */
export function resolveKnockoutSlotLabel(
  match: MatchTitleSource,
  side: 'home' | 'away'
): string {
  const title = match?.title?.trim();
  if (!title) {
    return KNOCKOUT_SLOT_UNDEFINED_LABEL;
  }

  const parts = title.split(MATCH_TITLE_SIDE_SEPARATOR).map((part) => part.trim());
  if (parts.length < 2) {
    return KNOCKOUT_SLOT_UNDEFINED_LABEL;
  }

  const label = parts[side === 'home' ? 0 : 1];
  return label || KNOCKOUT_SLOT_UNDEFINED_LABEL;
}
