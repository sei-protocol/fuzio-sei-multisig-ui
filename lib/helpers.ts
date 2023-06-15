import Decimal from 'decimal.js';

export const protectAgainstNaN = (value: number) => (isNaN(value) ? 0 : value);

export function convertMicroDenomToDenom(
  value: number | string | Decimal,
  decimals: number,
): Decimal {
  if (decimals === 0) return new Decimal(value);

  return new Decimal(Number(value) / Math.pow(10, decimals));
}

export function convertDenomToMicroDenom(
  value: number | string | Decimal,
  decimals: number,
): Decimal {
  if (decimals === 0) return new Decimal(value);

  return new Decimal(String(Number(value) * Math.pow(10, decimals)));
}
