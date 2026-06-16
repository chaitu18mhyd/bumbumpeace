export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "CAD"
  | "AUD"
  | "MXN"
  | "THB";

export type CurrencyInfo = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** Approximate, static rate: 1 USD = `rate` units of this currency. */
  rate: number;
  /** Sensible increment for the net-worth input in this currency. */
  step: number;
};

// NOTE: Rates are approximate and static (prototype only). For production,
// pull live FX rates from a server-side source and cache them.
export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US", rate: 1, step: 50000 },
  { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE", rate: 0.92, step: 50000 },
  { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB", rate: 0.79, step: 50000 },
  { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN", rate: 83, step: 5000000 },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", locale: "en-CA", rate: 1.36, step: 50000 },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", locale: "en-AU", rate: 1.52, step: 50000 },
  { code: "MXN", symbol: "MX$", label: "Mexican Peso", locale: "es-MX", rate: 17, step: 1000000 },
  { code: "THB", symbol: "฿", label: "Thai Baht", locale: "th-TH", rate: 36, step: 1000000 },
];

const BY_CODE: Record<CurrencyCode, CurrencyInfo> = CURRENCIES.reduce(
  (acc, c) => {
    acc[c.code] = c;
    return acc;
  },
  {} as Record<CurrencyCode, CurrencyInfo>
);

export function currencyInfo(code: CurrencyCode): CurrencyInfo {
  return BY_CODE[code] ?? BY_CODE.USD;
}

/** Convert a USD amount into the given currency. */
export function usdTo(amountUsd: number, code: CurrencyCode): number {
  return amountUsd * currencyInfo(code).rate;
}

/** Convert an amount in the given currency back into USD. */
export function toUsd(amount: number, code: CurrencyCode): number {
  return amount / currencyInfo(code).rate;
}

/** Format an amount that is already expressed in the given currency. */
export function formatCurrency(amount: number, code: CurrencyCode): string {
  const info = currencyInfo(code);
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a USD amount, converting it into the display currency first. */
export function formatUsdAs(amountUsd: number, code: CurrencyCode): string {
  return formatCurrency(usdTo(amountUsd, code), code);
}

/** Format a bare number with the currency's locale grouping (no symbol). */
export function formatNumber(amount: number, code: CurrencyCode): string {
  return new Intl.NumberFormat(currencyInfo(code).locale, {
    maximumFractionDigits: 0,
  }).format(amount);
}
