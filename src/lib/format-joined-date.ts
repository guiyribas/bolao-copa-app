export function formatJoinedPtBr(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
