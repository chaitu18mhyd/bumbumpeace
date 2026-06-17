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
 * How much each category grows per additional person (elasticity 0–1).
 * 0 = fully shared/fixed (housing), 1 = fully per-person (linear).
 * cost(n) = base × (1 + elasticity × (n − 1)).
 */
export const CATEGORY_ELASTICITY: Record<string, number> = {
  Rent: 0.2, // a couple needs a slightly bigger place, mostly shared
  Utilities: 0.15,
  Food: 0.9,
  Healthcare: 1.0,
  Travel: 0.85,
  Leisure: 0.8,
  Other: 0.5,
};

function householdFactor(label: string, people: number): number {
  const e = CATEGORY_ELASTICITY[label] ?? 0.7;
  return 1 + e * (Math.max(1, people) - 1);
}

/**
 * Break a single-person monthly cost (USD) into per-category amounts, scaled
 * for `people` in the household. Uses curated per-city `shares` when provided,
 * otherwise the default category percentages.
 */
export function expenseBreakdown(
  monthlyCostUsd: number,
  shares?: Record<string, number>,
  people: number = 1
): ExpenseSlice[] {
  return EXPENSE_CATEGORIES.map((cat) => {
    const pct = shares?.[cat.label] ?? cat.pct;
    const amountUsd = monthlyCostUsd * pct * householdFactor(cat.label, people);
    return { ...cat, pct, amountUsd };
  });
}

/** Total monthly cost (USD) for a household of `people`, from the breakdown. */
export function scaledMonthlyCost(
  monthlyCostUsd: number,
  shares: Record<string, number> | undefined,
  people: number
): number {
  return expenseBreakdown(monthlyCostUsd, shares, people).reduce(
    (sum, s) => sum + s.amountUsd,
    0
  );
}
