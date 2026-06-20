"use client";

import {
  ChevronDown,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  type ChangeEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Region } from "@/data/cities";
import {
  amountInWords,
  CURRENCIES,
  type CurrencyCode,
  currencyInfo,
  formatNumber,
  formatUsdAs,
} from "@/lib/currency";

export type RegionFilter = "All" | Region;

// Run layout effects only on the client (avoids SSR warnings).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function countDigits(s: string): number {
  return (s.match(/\d/g) || []).length;
}

function caretFromDigits(formatted: string, digits: number): number {
  if (digits <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] >= "0" && formatted[i] <= "9") {
      count++;
      if (count === digits) return i + 1;
    }
  }
  return formatted.length;
}

/**
 * Controlled money input that formats with thousands separators while keeping
 * the caret in place (by counting digits to the left of the cursor instead of
 * snapping to the end). Returns props to spread onto an <input>.
 */
function useMoneyInput(
  value: number,
  currency: CurrencyCode,
  onChange: (n: number) => void
) {
  const ref = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);
  const display = Number.isFinite(value) ? formatNumber(value, currency) : "";

  useIsoLayoutEffect(() => {
    if (pendingCaret.current === null || !ref.current) return;
    const pos = caretFromDigits(ref.current.value, pendingCaret.current);
    ref.current.setSelectionRange(pos, pos);
    pendingCaret.current = null;
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    pendingCaret.current = countDigits(el.value.slice(0, caret));
    const digits = el.value.replace(/[^0-9]/g, "");
    onChange(digits === "" ? NaN : Number(digits));
  };

  return { ref, value: display, onChange: handleChange };
}

export const WITHDRAWAL_RATES = [
  { value: 0.03, label: "3% — Conservative" },
  { value: 0.035, label: "3.5% — Cautious" },
  { value: 0.04, label: "4% — Recommended" },
  { value: 0.05, label: "5% — Aggressive" },
] as const;

type FilterPanelProps = {
  investableAssets: number;
  monthlyIncome: number;
  currency: CurrencyCode;
  withdrawalRate: number;
  monthlyBudgetUsd: number;
  region: RegionFilter;
  availableRegions: Region[];
  searchQuery: string;
  householdSize: number;
  availableTags: string[];
  selectedTags: string[];
  onInvestableAssetsChange: (value: number) => void;
  onMonthlyIncomeChange: (value: number) => void;
  onCurrencyChange: (value: CurrencyCode) => void;
  onWithdrawalRateChange: (value: number) => void;
  onRegionChange: (value: RegionFilter) => void;
  onSearchChange: (value: string) => void;
  onHouseholdSizeChange: (value: number) => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
};

const MAX_HOUSEHOLD = 8;

function householdLabel(n: number): string {
  if (n === 1) return "Single";
  if (n === 2) return "Couple";
  return `${n} people`;
}

const selectClass =
  "w-full appearance-none rounded-xl border border-sand bg-cream px-3.5 py-2.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200";

const DEFAULT_RATE = 0.04;

export default function FilterPanel({
  investableAssets,
  monthlyIncome,
  currency,
  withdrawalRate,
  monthlyBudgetUsd,
  region,
  availableRegions,
  searchQuery,
  householdSize,
  availableTags,
  selectedTags,
  onInvestableAssetsChange,
  onMonthlyIncomeChange,
  onCurrencyChange,
  onWithdrawalRateChange,
  onRegionChange,
  onSearchChange,
  onHouseholdSizeChange,
  onToggleTag,
  onClearTags,
}: FilterPanelProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const info = currencyInfo(currency);

  const assetsInput = useMoneyInput(
    investableAssets,
    currency,
    onInvestableAssetsChange
  );
  const incomeInput = useMoneyInput(
    monthlyIncome,
    currency,
    onMonthlyIncomeChange
  );

  const ratePct = `${Math.round(withdrawalRate * 100 * 10) / 10}%`;
  const hasIncome = Number.isFinite(monthlyIncome) && monthlyIncome > 0;
  const activeCount =
    (region !== "All" ? 1 : 0) +
    (withdrawalRate !== DEFAULT_RATE ? 1 : 0) +
    (hasIncome ? 1 : 0) +
    (householdSize !== 2 ? 1 : 0) +
    selectedTags.length;

  const summary = [
    householdLabel(householdSize),
    `${ratePct} withdrawal`,
    hasIncome ? `${formatNumber(monthlyIncome, currency)} income` : null,
    region === "All" ? "All regions" : region,
    selectedTags.length > 0
      ? `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      aria-label="Retirement budget"
      className="sticky top-16 z-20 -mx-4 border-b border-sand bg-cream/85 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:rounded-3xl sm:border sm:px-6 sm:py-6 sm:shadow-sm"
    >
      {/* Primary input: investable assets (retirement corpus) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-1 flex-col gap-1.5">
          <label
            htmlFor="investableAssets"
            className="text-xs font-semibold tracking-wide text-muted"
          >
            INVESTABLE ASSETS (brokerage, retirement accounts, cash) — exclude your home.
          </label>
          <div className="flex">
            <div className="relative">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) =>
                  onCurrencyChange(e.target.value as CurrencyCode)
                }
                className="h-full cursor-pointer appearance-none rounded-l-2xl border border-r-0 border-sand bg-sand/60 py-3.5 pl-4 pr-9 text-sm font-bold text-ink outline-none transition hover:bg-sand focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                aria-label="Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-600"
              />
            </div>
            <div className="relative flex-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted"
              >
                {info.symbol}
              </span>
              <input
                id="investableAssets"
                ref={assetsInput.ref}
                type="text"
                inputMode="numeric"
                value={assetsInput.value}
                onChange={assetsInput.onChange}
                className="w-full rounded-r-2xl border border-sand bg-cream py-3.5 pl-10 pr-4 text-2xl font-extrabold tracking-tight text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                placeholder={formatNumber(1200000, currency)}
              />
            </div>
          </div>
          {amountInWords(investableAssets, currency) && (
            <p className="text-sm font-semibold text-brand-700">
              {info.symbol}
              {amountInWords(investableAssets, currency)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 sm:flex-col sm:items-start sm:justify-center sm:py-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
            <Wallet aria-hidden="true" className="h-3.5 w-3.5" />
            Monthly budget
          </p>
          <p className="text-2xl font-bold tracking-tight text-brand-700">
            {formatUsdAs(monthlyBudgetUsd, currency)}
            <span className="ml-1 text-sm font-medium text-muted">/mo</span>
          </p>
        </div>
      </div>

      {/* Search any city by name (ignores budget) */}
      <div className="relative mt-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          id="citySearch"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search any city or country…"
          aria-label="Search cities"
          className="w-full rounded-xl border border-sand bg-cream py-2.5 pl-10 pr-10 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
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
            <SlidersHorizontal
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-brand-600"
            />
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
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
              filtersOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          id="advanced-filters"
          aria-hidden={!filtersOpen}
          className={`overflow-hidden transition-all duration-300 ease-out ${
            filtersOpen
              ? "max-h-[80rem] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="mt-3 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              Household
            </span>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-sand bg-cream">
                <button
                  type="button"
                  onClick={() =>
                    onHouseholdSizeChange(Math.max(1, householdSize - 1))
                  }
                  disabled={householdSize <= 1}
                  tabIndex={filtersOpen ? 0 : -1}
                  aria-label="Fewer people"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-l-xl text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus aria-hidden="true" className="h-4 w-4" />
                </button>
                <span
                  className="w-10 text-center text-sm font-bold text-ink"
                  aria-live="polite"
                >
                  {householdSize}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onHouseholdSizeChange(
                      Math.min(MAX_HOUSEHOLD, householdSize + 1)
                    )
                  }
                  disabled={householdSize >= MAX_HOUSEHOLD}
                  tabIndex={filtersOpen ? 0 : -1}
                  aria-label="More people"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-r-xl text-ink transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-ink">
                {householdLabel(householdSize)}
              </span>
            </div>
            <p className="text-xs text-muted">
              Costs scale for more people — housing is mostly shared; food &amp;
              healthcare are roughly per person.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <label
              htmlFor="monthlyIncome"
              className="text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Monthly income{" "}
              <span className="font-normal normal-case text-muted/70">
                (optional)
              </span>
            </label>
            <div className="relative sm:max-w-xs">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-muted"
              >
                {info.symbol}
              </span>
              <input
                id="monthlyIncome"
                ref={incomeInput.ref}
                type="text"
                inputMode="numeric"
                value={incomeInput.value}
                onChange={incomeInput.onChange}
                tabIndex={filtersOpen ? 0 : -1}
                className="w-full rounded-xl border border-sand bg-cream py-2.5 pl-9 pr-4 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                placeholder="0"
              />
            </div>
            {amountInWords(monthlyIncome, currency) && (
              <p className="text-xs font-semibold text-brand-700">
                {info.symbol}
                {amountInWords(monthlyIncome, currency)}
              </p>
            )}
            <p className="text-xs text-muted">
              Social Security, pension, rental, etc. — added to your monthly
              budget.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                {availableRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {availableTags.length > 0 && (
            <fieldset className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Tags{" "}
                  <span className="font-normal normal-case text-muted/70">
                    (match all selected)
                  </span>
                </legend>
                {selectedTags.length > 0 ? (
                  <button
                    type="button"
                    onClick={onClearTags}
                    className="text-xs font-semibold text-brand-700 transition hover:text-brand-900"
                    tabIndex={filtersOpen ? 0 : -1}
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              <div>
                <label htmlFor="tagsSelect" className="sr-only">
                  Select tags
                </label>
                <select
                  id="tagsSelect"
                  multiple
                  size={Math.min(6, availableTags.length)}
                  value={selectedTags}
                  onChange={(e) => {
                    const nextSelected = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );

                    availableTags.forEach((tag) => {
                      const currentlySelected = selectedTags.includes(tag);
                      const shouldBeSelected = nextSelected.includes(tag);
                      if (currentlySelected !== shouldBeSelected) {
                        onToggleTag(tag);
                      }
                    });
                  }}
                  tabIndex={filtersOpen ? 0 : -1}
                  className="w-full max-h-52 min-h-[10rem] overflow-auto rounded-3xl border border-sand bg-cream p-3 text-sm text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
                >
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
          )}

        </div>
      </div>
    </section>
  );
}
