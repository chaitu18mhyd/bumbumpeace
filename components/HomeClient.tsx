"use client";

import { ArrowDown, ArrowUp, MapPinOff, PiggyBank, Scale, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import CityCard from "@/components/CityCard";
import CityDetail from "@/components/CityDetail";
import ComparePanel from "@/components/ComparePanel";
import FilterPanel, {
  type LifestyleFilter,
  type RegionFilter,
} from "@/components/FilterPanel";
import type { City } from "@/data/cities";
import { type CurrencyCode, toUsd, usdTo } from "@/lib/currency";
import { scaledMonthlyCost } from "@/lib/expenses";
import { cityRating } from "@/lib/rating";

type SortBy = "featured" | "rating" | "cost-asc" | "cost-desc";

const DEFAULT_INVESTABLE_ASSETS = 1_200_000;
const DEFAULT_WITHDRAWAL_RATE = 0.04;
const PAGE_SIZE = 3;

const cityKey = (c: City) => `${c.city}-${c.country}`;

type HomeClientProps = {
  cities: City[];
};

export default function HomeClient({ cities }: HomeClientProps) {
  const [investableAssets, setInvestableAssets] = useState<number>(
    DEFAULT_INVESTABLE_ASSETS
  );
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [withdrawalRate, setWithdrawalRate] = useState<number>(
    DEFAULT_WITHDRAWAL_RATE
  );
  const [region, setRegion] = useState<RegionFilter>("All");
  const [lifestyle, setLifestyle] = useState<LifestyleFilter>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Household size — defaults to a couple.
  const [householdSize, setHouseholdSize] = useState(2);
  const [sortBy, setSortBy] = useState<SortBy>("featured");

  // Pin / compare
  const [pinned, setPinned] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const togglePin = (c: City) =>
    setPinned((prev) =>
      prev.includes(cityKey(c))
        ? prev.filter((k) => k !== cityKey(c))
        : [...prev, cityKey(c)]
    );
  const pinnedCities = useMemo(
    () => cities.filter((c) => pinned.includes(cityKey(c))),
    [cities, pinned]
  );

  const allTags = useMemo(
    () => Array.from(new Set(cities.flatMap((c) => c.tags))).sort(),
    [cities]
  );

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  // Inputs are stored in the selected display currency. Convert to USD (the
  // canonical unit for the city data) for all budget comparisons.
  const safeAssets = Number.isFinite(investableAssets)
    ? Math.max(investableAssets, 0)
    : 0;
  const safeIncome = Number.isFinite(monthlyIncome)
    ? Math.max(monthlyIncome, 0)
    : 0;

  // Budget = safe-withdrawal draw from the investable corpus + recurring
  // monthly income (Social Security, pension, rental, etc.).
  const drawUsd = (toUsd(safeAssets, currency) * withdrawalRate) / 12;
  const incomeUsd = toUsd(safeIncome, currency);
  const budgetUsd = Math.round(drawUsd + incomeUsd);

  // Switching currency keeps real values constant by converting the inputs.
  const handleCurrencyChange = (next: CurrencyCode) => {
    const convert = (v: number) =>
      Number.isFinite(v) ? Math.round(usdTo(toUsd(v, currency), next)) : v;
    setInvestableAssets(convert);
    setMonthlyIncome(convert);
    setCurrency(next);
  };

  const q = searchQuery.trim().toLowerCase();
  const costFor = useCallback(
    (city: City) =>
      scaledMonthlyCost(city.monthlyCost, city.expenseShares, householdSize),
    [householdSize]
  );

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      if (region !== "All" && city.region !== region) return false;
      if (lifestyle !== "All" && city.lifestyle !== lifestyle) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.every((t) => city.tags.includes(t))
      ) {
        return false;
      }
      // With a search query, match by name across ALL cities (ignore budget)
      // so you can look up any city. Otherwise default to within-budget only.
      if (q) {
        return `${city.city} ${city.country}`.toLowerCase().includes(q);
      }
      return costFor(city) <= budgetUsd;
    });
  }, [cities, region, lifestyle, selectedTags, q, budgetUsd, costFor]);

  const underBudgetCount = useMemo(
    () => filteredCities.filter((city) => costFor(city) <= budgetUsd).length,
    [filteredCities, budgetUsd, costFor]
  );

  const sortedCities = useMemo(() => {
    const arr = [...filteredCities];
    if (sortBy === "rating") arr.sort((a, b) => cityRating(b) - cityRating(a));
    else if (sortBy === "cost-asc") arr.sort((a, b) => costFor(a) - costFor(b));
    else if (sortBy === "cost-desc") arr.sort((a, b) => costFor(b) - costFor(a));
    return arr;
  }, [filteredCities, sortBy, costFor]);

  // Windowed pager: show PAGE_SIZE cities at a time.
  const [windowStart, setWindowStart] = useState(0);
  // Direction of the last page change, to slide the grid the right way.
  const [slideDir, setSlideDir] = useState<"next" | "prev" | null>(null);
  const slideClass =
    slideDir === "next"
      ? "animate-slide-in-up"
      : slideDir === "prev"
        ? "animate-slide-in-down"
        : "animate-fade-slide";

  // Reset to the first window whenever the filter/sort criteria change.
  useEffect(() => {
    setWindowStart(0);
  }, [region, lifestyle, selectedTags, q, householdSize, sortBy]);

  const total = sortedCities.length;
  const clampedStart = Math.min(windowStart, Math.max(0, total - PAGE_SIZE));
  const visibleCities = sortedCities.slice(
    clampedStart,
    clampedStart + PAGE_SIZE
  );
  const hasPrev = clampedStart > 0;
  const hasNext = clampedStart + PAGE_SIZE < total;
  const rangeStart = total === 0 ? 0 : clampedStart + 1;
  const rangeEnd = Math.min(clampedStart + PAGE_SIZE, total);

  // Selected city → expense breakdown card at the bottom.
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  useEffect(() => {
    if (selectedCity) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCity]);

  // Position the detail card's caret under the horizontal center of the
  // clicked city card, so it visually points back to it.
  const recomputeCaret = useCallback(() => {
    if (!selectedCity) {
      setCaretLeft(null);
      return;
    }
    const key = `${selectedCity.city}-${selectedCity.country}`;
    const card = cardRefs.current.get(key);
    const wrap = detailRef.current;
    if (!card || !wrap) {
      setCaretLeft(null);
      return;
    }
    const cardRect = card.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    const center = cardRect.left + cardRect.width / 2 - wrapRect.left;
    setCaretLeft(Math.max(24, Math.min(center, wrapRect.width - 24)));
  }, [selectedCity]);

  useLayoutEffect(() => {
    recomputeCaret();
  }, [
    recomputeCaret,
    clampedStart,
    currency,
    investableAssets,
    monthlyIncome,
    withdrawalRate,
    region,
    lifestyle,
    selectedTags,
    q,
    householdSize,
  ]);

  useEffect(() => {
    window.addEventListener("resize", recomputeCaret);
    return () => window.removeEventListener("resize", recomputeCaret);
  }, [recomputeCaret]);

  return (
    <main id="top">
      {/* Get to the point: ask for investable assets immediately */}
      <section
        id="explore"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-6 sm:px-6 sm:pt-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <PiggyBank aria-hidden="true" className="h-6 w-6" />
          </span>
          <h1 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Enter your investable assets to see where you can retire
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-muted sm:text-base">
            We turn it into a sustainable monthly budget and instantly show the
            cities you can actually afford.
          </p>
        </div>

        <div className="mt-6">
          <FilterPanel
            investableAssets={investableAssets}
            monthlyIncome={monthlyIncome}
            currency={currency}
            withdrawalRate={withdrawalRate}
            monthlyBudgetUsd={budgetUsd}
            region={region}
            lifestyle={lifestyle}
            searchQuery={searchQuery}
            householdSize={householdSize}
            availableTags={allTags}
            selectedTags={selectedTags}
            onHouseholdSizeChange={setHouseholdSize}
            onInvestableAssetsChange={setInvestableAssets}
            onMonthlyIncomeChange={setMonthlyIncome}
            onCurrencyChange={handleCurrencyChange}
            onWithdrawalRateChange={setWithdrawalRate}
            onRegionChange={setRegion}
            onLifestyleChange={setLifestyle}
            onSearchChange={setSearchQuery}
            onToggleTag={toggleTag}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p
            aria-live="polite"
            className="text-sm font-medium text-ink sm:text-base"
          >
            Showing{" "}
            <span className="font-bold text-brand-700">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            of <span className="font-bold text-brand-700">{total}</span>{" "}
            {total === 1 ? "city" : "cities"}.{" "}
            <span className="font-bold text-under-700">{underBudgetCount}</span>{" "}
            {underBudgetCount === 1 ? "is" : "are"} under your budget.
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs font-medium text-muted">
              Sort
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="appearance-none rounded-lg border border-sand bg-cream px-3 py-1.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            >
              <option value="featured">Featured</option>
              <option value="rating">Rating (high to low)</option>
              <option value="cost-asc">Cost (low to high)</option>
              <option value="cost-desc">Cost (high to low)</option>
            </select>
          </div>
        </div>

        {total > 0 ? (
          <>
            {hasPrev && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSlideDir("prev");
                    setSelectedCity(null);
                    setWindowStart(Math.max(0, clampedStart - PAGE_SIZE));
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-sand bg-white px-5 py-2.5 text-sm font-semibold text-muted shadow-sm transition hover:bg-sand hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  Show previous
                </button>
              </div>
            )}

            <ul
              key={clampedStart}
              className={`mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${slideClass}`}
            >
              {visibleCities.map((city) => {
                const key = `${city.city}-${city.country}`;
                return (
                  <li
                    key={key}
                    ref={(el) => {
                      if (el) cardRefs.current.set(key, el);
                      else cardRefs.current.delete(key);
                    }}
                    className="h-full"
                  >
                    <CityCard
                      city={city}
                      budgetUsd={budgetUsd}
                      currency={currency}
                      people={householdSize}
                      selected={
                        selectedCity?.city === city.city &&
                        selectedCity?.country === city.country
                      }
                      pinned={pinned.includes(key)}
                      onSelect={() => setSelectedCity(city)}
                      onTogglePin={() => togglePin(city)}
                    />
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-sand bg-white/60 px-6 py-16 text-center">
            <MapPinOff
              aria-hidden="true"
              className="mx-auto mb-3 h-8 w-8 text-muted"
            />
            <p className="text-base font-semibold text-ink">
              No cities match your filters
            </p>
            <p className="mt-1 text-sm text-muted">
              Try raising your budget or widening the region, lifestyle, or tag
              filters.
            </p>
          </div>
        )}

        <div ref={detailRef}>
          {selectedCity && (
            <CityDetail
              city={selectedCity}
              currency={currency}
              people={householdSize}
              caretLeft={caretLeft}
              onClose={() => setSelectedCity(null)}
            />
          )}
        </div>

        {hasNext && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSlideDir("next");
                setSelectedCity(null);
                setWindowStart(clampedStart + PAGE_SIZE);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-300 bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
              Load more
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-sand bg-sand/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted sm:px-6">
          BumBumSafe · Prototype with mock data · Estimates only — not financial
          advice.
        </div>
      </footer>

      {/* Floating compare bar */}
      {pinnedCities.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-full border border-sand bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:gap-3 sm:px-4">
            <span className="text-sm font-semibold text-ink">
              {pinnedCities.length} pinned
            </span>
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              disabled={pinnedCities.length < 2}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Scale aria-hidden="true" className="h-4 w-4" />
              Compare
            </button>
            <button
              type="button"
              onClick={() => setPinned([])}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm font-medium text-muted transition hover:text-ink"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      )}

      {compareOpen && pinnedCities.length > 0 && (
        <ComparePanel
          cities={pinnedCities}
          currency={currency}
          budgetUsd={budgetUsd}
          people={householdSize}
          onClose={() => setCompareOpen(false)}
          onUnpin={togglePin}
        />
      )}
    </main>
  );
}
