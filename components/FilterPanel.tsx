"use client";

import { LIFESTYLES, REGIONS } from "@/data/cities";

export type RegionFilter = "All" | (typeof REGIONS)[number];
export type LifestyleFilter = "All" | (typeof LIFESTYLES)[number];

type FilterPanelProps = {
  budget: number;
  region: RegionFilter;
  lifestyle: LifestyleFilter;
  onlyUnderBudget: boolean;
  onBudgetChange: (value: number) => void;
  onRegionChange: (value: RegionFilter) => void;
  onLifestyleChange: (value: LifestyleFilter) => void;
  onOnlyUnderBudgetChange: (value: boolean) => void;
};

const selectClass =
  "w-full appearance-none rounded-xl border border-sand bg-cream px-3.5 py-2.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200";

export default function FilterPanel({
  budget,
  region,
  lifestyle,
  onlyUnderBudget,
  onBudgetChange,
  onRegionChange,
  onLifestyleChange,
  onOnlyUnderBudgetChange,
}: FilterPanelProps) {
  return (
    <section
      aria-label="City filters"
      className="sticky top-0 z-20 -mx-4 border-b border-sand bg-cream/85 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:rounded-3xl sm:border sm:px-6 sm:py-6 sm:shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="budget"
            className="text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Monthly budget
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted"
            >
              $
            </span>
            <input
              id="budget"
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={Number.isNaN(budget) ? "" : budget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="w-full rounded-xl border border-sand bg-cream py-2.5 pl-7 pr-3.5 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="4000"
            />
          </div>
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

        <div className="flex items-end">
          <label
            htmlFor="onlyUnderBudget"
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-sand bg-cream px-3.5 py-2.5 shadow-sm transition hover:border-brand-300"
          >
            <span className="text-sm font-medium text-ink">
              Only under my budget
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
      </div>
    </section>
  );
}
