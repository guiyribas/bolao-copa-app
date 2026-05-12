export const POOL_VALUE_MAX_DIGITS = 12;

/** Dígitos interpretados como centavos (ex.: "2050" → R$ 20,50). */
export function formatPoolValueBRL(digits: string): string {
  if (!digits) return '';
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents) || cents < 0) return '';
  const n = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function poolValueDigitsToNumber(digits: string): number | undefined {
  if (!digits) return undefined;
  const cents = Number.parseInt(digits, 10);
  if (!Number.isFinite(cents) || cents < 0)
    throw new Error('Informe um valor válido (≥ 0) ou deixe em branco.');
  return cents / 100;
}

export function handlePoolValueRawInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, POOL_VALUE_MAX_DIGITS);
}
