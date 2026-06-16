export type ExpenseCategory = {
  label: string;
  /** Share of the monthly cost (0–1). All categories sum to 1. */
  pct: number;
  color: string;
  /** Use dark text on this slice (for light-colored slices). */
  dark?: boolean;
};

// Mock allocation of a city's monthly cost across spending categories.
// Percentages sum to 1.0. Friendly, warm palette — no red / warning colors.
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { label: "Rent", pct: 0.35, color: "#f4c430", dark: true },
  { label: "Food", pct: 0.2, color: "#2f6fed" },
  { label: "Travel", pct: 0.12, color: "#ed8936" },
  { label: "Healthcare", pct: 0.12, color: "#38b2ac" },
  { label: "Utilities", pct: 0.08, color: "#9f7aea" },
  { label: "Leisure", pct: 0.08, color: "#48bb78" },
  { label: "Other", pct: 0.05, color: "#cbd5e0", dark: true },
];

export type ExpenseSlice = ExpenseCategory & { amountUsd: number };

/**
 * Break a total monthly cost (USD) into per-category amounts.
 * Uses curated per-city `shares` (keyed by category label) when provided,
 * otherwise falls back to the default category percentages.
 */
export function expenseBreakdown(
  monthlyCostUsd: number,
  shares?: Record<string, number>
): ExpenseSlice[] {
  return EXPENSE_CATEGORIES.map((cat) => {
    const pct = shares?.[cat.label] ?? cat.pct;
    return { ...cat, pct, amountUsd: monthlyCostUsd * pct };
  });
}
