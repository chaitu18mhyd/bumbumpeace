"use client";

import { useState } from "react";
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

const DEFAULT_RATE = 0.04;

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const ratePct = `${Math.round(withdrawalRate * 100 * 10) / 10}%`;
  const activeCount =
    (region !== "All" ? 1 : 0) +
    (lifestyle !== "All" ? 1 : 0) +
    (withdrawalRate !== DEFAULT_RATE ? 1 : 0) +
    (onlyUnderBudget ? 1 : 0);

  const summary = [
    `${ratePct} withdrawal`,
    region === "All" ? "All regions" : region,
    lifestyle === "All" ? "All lifestyles" : lifestyle,
    onlyUnderBudget ? "Within budget only" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      aria-label="Retirement budget"
      className="sticky top-16 z-20 -mx-4 border-b border-sand bg-cream/85 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:rounded-3xl sm:border sm:px-6 sm:py-6 sm:shadow-sm"
    >
      {/* Primary input: net worth */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="netWorth"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Your net worth
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted"
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
              className="w-full rounded-2xl border border-sand bg-cream py-3.5 pl-9 pr-4 text-2xl font-extrabold tracking-tight text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="1200000"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-col sm:items-start sm:justify-center sm:py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Monthly budget
          </p>
          <p className="text-2xl font-bold tracking-tight text-brand-700">
            {formatUSD(monthlyBudget)}
            <span className="ml-1 text-sm font-medium text-muted">/mo</span>
          </p>
        </div>
      </div>

      {/* Filters disclosure */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="advanced-filters"
          className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-2 text-left transition hover:opacity-80"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                {activeCount}
              </span>
            )}
            <span className="hidden text-xs text-muted sm:inline">
              {summary}
            </span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
              filtersOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div
          id="advanced-filters"
          aria-hidden={!filtersOpen}
          className={`overflow-hidden transition-all duration-300 ease-out ${
            filtersOpen
              ? "max-h-[28rem] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <p className="px-1 pt-1 text-xs text-muted">
            Assumptions are pre-filled — adjust any of them below.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                tabIndex={filtersOpen ? 0 : -1}
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
                tabIndex={filtersOpen ? 0 : -1}
              >
                <option value="All">All regions</option>
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
                tabIndex={filtersOpen ? 0 : -1}
              >
                <option value="All">All lifestyles</option>
                {LIFESTYLES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label
            htmlFor="onlyUnderBudget"
            className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-sand bg-cream px-4 py-3 shadow-sm transition hover:border-brand-300"
          >
            <span className="text-sm font-medium text-ink">
              Only show cities within my budget
            </span>
            <input
              id="onlyUnderBudget"
              type="checkbox"
              checked={onlyUnderBudget}
              onChange={(e) => onOnlyUnderBudgetChange(e.target.checked)}
              tabIndex={filtersOpen ? 0 : -1}
              className="h-5 w-5 shrink-0 rounded-md border-sand text-brand-500 accent-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
