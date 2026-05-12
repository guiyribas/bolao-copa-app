export function formatPoolRankingLabel(
  place: number | null | undefined,
  total: number
): string | null {
  if (total <= 0) return null;
  if (place == null) {
    return `Posição indisponível de ${total} participantes`;
  }
  return `${place}º de ${total} participantes`;
}

export function formatPoolRankingAriaLabel(
  place: number | null | undefined,
  total: number
): string | null {
  if (total <= 0) return null;
  if (place == null) {
    return `Posição indisponível no ranking do bolão, entre ${total} participantes`;
  }
  return `Posição ${place} de ${total} no ranking do bolão`;
}
