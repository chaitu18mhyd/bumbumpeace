"use client";

import { LIFESTYLES, REGIONS } from "@/data/cities";
import { formatUSD } from "@/lib/format";

export type RegionFilter = "All" | (typeof REGIONS)[number];
export type LifestyleFilter = "All" | (typeof LIFESTYLES)[number];

export const WITHDRAWAL_RATES = [
  { value: 0.03, label: "3% — Conservative" },
  { value: 0.035, label: "3.5% — Cautious" },
  { value: 0.04, label: "4% — Recommended" },
  { value: 0.05, label: "5% — Aggressive" },
] as const;

type FilterPanelProps = {
  netWorth: number;
  withdrawalRate: number;
  monthlyBudget: number;
  region: RegionFilter;
  lifestyle: LifestyleFilter;
  onlyUnderBudget: boolean;
  onNetWorthChange: (value: number) => void;
  onWithdrawalRateChange: (value: number) => void;
  onRegionChange: (value: RegionFilter) => void;
  onLifestyleChange: (value: LifestyleFilter) => void;
  onOnlyUnderBudgetChange: (value: boolean) => void;
};

const selectClass =
  "w-full appearance-none rounded-xl border border-sand bg-cream px-3.5 py-2.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200";

export default function FilterPanel({
  netWorth,
  withdrawalRate,
  monthlyBudget,
  region,
  lifestyle,
  onlyUnderBudget,
  onNetWorthChange,
  onWithdrawalRateChange,
  onRegionChange,
  onLifestyleChange,
  onOnlyUnderBudgetChange,
}: FilterPanelProps) {
  return (
    <section
      aria-label="City filters"
      className="sticky top-16 z-20 -mx-4 border-b border-sand bg-cream/85 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:rounded-3xl sm:border sm:px-6 sm:py-6 sm:shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="netWorth"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Net worth
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted"
            >
              $
            </span>
            <input
              id="netWorth"
              type="number"
              inputMode="numeric"
              min={0}
              step={50000}
              value={Number.isNaN(netWorth) ? "" : netWorth}
              onChange={(e) => onNetWorthChange(Number(e.target.value))}
              className="w-full rounded-xl border border-sand bg-cream py-2.5 pl-7 pr-3.5 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="1200000"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="withdrawalRate"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Annual withdrawal rate
          </label>
          <select
            id="withdrawalRate"
            value={withdrawalRate}
            onChange={(e) => onWithdrawalRateChange(Number(e.target.value))}
            className={selectClass}
          >
            {WITHDRAWAL_RATES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="region"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Region
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => onRegionChange(e.target.value as RegionFilter)}
            className={selectClass}
          >
            <option value="All">All</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lifestyle"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Lifestyle
          </label>
          <select
            id="lifestyle"
            value={lifestyle}
            onChange={(e) =>
              onLifestyleChange(e.target.value as LifestyleFilter)
            }
            className={selectClass}
          >
            <option value="All">All</option>
            {LIFESTYLES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Estimated monthly budget
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {Math.round(withdrawalRate * 100 * 10) / 10}% of{" "}
              {formatUSD(Number.isFinite(netWorth) ? netWorth : 0)} per year
            </p>
          </div>
          <p className="shrink-0 text-2xl font-bold tracking-tight text-brand-700">
            {formatUSD(monthlyBudget)}
            <span className="ml-1 text-sm font-medium text-muted">/mo</span>
          </p>
        </div>

        <label
          htmlFor="onlyUnderBudget"
          className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-sand bg-cream px-4 py-3 shadow-sm transition hover:border-brand-300 sm:w-64"
        >
          <span className="text-sm font-medium text-ink">
            Only within my budget
          </span>
          <input
            id="onlyUnderBudget"
            type="checkbox"
            checked={onlyUnderBudget}
            onChange={(e) => onOnlyUnderBudgetChange(e.target.checked)}
            className="h-5 w-5 shrink-0 rounded-md border-sand text-brand-500 accent-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>
    </section>
  );
}
