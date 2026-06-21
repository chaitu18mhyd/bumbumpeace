"use client";

import { ArrowDown, ArrowUp, MapPinOff, Scale, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CityCard from "@/components/CityCard";
import CityModal from "@/components/CityModal";
import ComparePanel from "@/components/ComparePanel";
import FilterPanel, { type RegionFilter } from "@/components/FilterPanel";
import { REGIONS, type City } from "@/data/cities";
import { type CurrencyCode, toUsd, usdTo } from "@/lib/currency";
import { scaledMonthlyCost } from "@/lib/expenses";
import { cityRating } from "@/lib/rating";
import {
  trackPagination,
  trackComparePanel,
  trackClearFilters,
  trackBudgetAdjustment,
  trackCurrencyChange,
} from "@/lib/analytics";

type SortBy = "featured" | "rating" | "cost-asc" | "cost-desc";

const DEFAULT_INVESTABLE_ASSETS = 1_200_000;
const DEFAULT_WITHDRAWAL_RATE = 0.04;
const PAGE_SIZE = 3;

type CityItem = {
  city: City;
  key: string;
};

type HomeClientProps = {
  cities: City[];
};

export default function HomeClient({ cities }: HomeClientProps) {
  const citiesWithKeys = useMemo(
    () =>
      cities.map((city, index) => ({
        city,
        key: `${city.city}-${city.country}-${index}`,
      })),
    [cities]
  );

  const [investableAssets, setInvestableAssets] = useState<number>(
    DEFAULT_INVESTABLE_ASSETS
  );
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [withdrawalRate, setWithdrawalRate] = useState<number>(
    DEFAULT_WITHDRAWAL_RATE
  );
  const [region, setRegion] = useState<RegionFilter>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Household size — defaults to a couple.
  const [householdSize, setHouseholdSize] = useState(2);
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [hydrated, setHydrated] = useState(false);

  // Pin / compare
  const [pinned, setPinned] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedCityKey, setSelectedCityKey] = useState<string | null>(null);
  const MAX_COMPARE = 2;
  const togglePin = (key: string) =>
    setPinned((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, key];
    });

  const handleUnpin = (city: City) => {
    const item = citiesWithKeys.find((item) => item.city === city);
    if (item) {
      togglePin(item.key);
    }
  };

  const pinnedCities = useMemo(
    () =>
      citiesWithKeys
        .filter((item) => pinned.includes(item.key))
        .map((item) => item.city),
    [citiesWithKeys, pinned]
  );

  const selectedCity = useMemo(
    () => citiesWithKeys.find((item) => item.key === selectedCityKey)?.city ?? null,
    [citiesWithKeys, selectedCityKey]
  );

  const allTags = useMemo(
    () => Array.from(new Set(cities.flatMap((c) => c.tags))).sort(),
    [cities]
  );
  const availableRegions = useMemo(
    () => {
      // During SSR and initial hydration, filter by existing cities to avoid mismatch.
      // After hydration (when hydrated=true), show all configured regions.
      if (hydrated) {
        return REGIONS;
      }
      return REGIONS.filter((region) => cities.some((city) => city.region === region));
    },
    [cities, hydrated]
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
    return citiesWithKeys.filter(({ city }) => {
      if (region !== "All" && city.region !== region) return false;
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
  }, [citiesWithKeys, region, selectedTags, q, budgetUsd, costFor]);

  const underBudgetCount = useMemo(
    () => filteredCities.filter((item) => costFor(item.city) <= budgetUsd).length,
    [filteredCities, budgetUsd, costFor]
  );

  const sortedCities = useMemo(() => {
    const arr = [...filteredCities];
    if (sortBy === "rating")
      arr.sort((a, b) => cityRating(b.city) - cityRating(a.city));
    else if (sortBy === "cost-asc") arr.sort((a, b) => costFor(a.city) - costFor(b.city));
    else if (sortBy === "cost-desc") arr.sort((a, b) => costFor(b.city) - costFor(a.city));
    return arr;
  }, [filteredCities, sortBy, costFor]);

  // Windowed pager: show PAGE_SIZE cities at a time.
  const [windowStart, setWindowStart] = useState(0);
  const listTopRef = useRef<HTMLDivElement | null>(null);
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
  }, [region, selectedTags, q, householdSize, sortBy]);

  // Mark component as hydrated after mount to show all regions (avoids hydration mismatch).
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (region !== "All" && !availableRegions.includes(region)) {
      setRegion("All");
    }
  }, [availableRegions, region]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const total = sortedCities.length;
  const clampedStart = Math.min(windowStart, Math.max(0, total - PAGE_SIZE));
  const visibleCities = sortedCities.slice(
    clampedStart,
    clampedStart + PAGE_SIZE
  );
  const displayedCities = visibleCities;
  const hasPrev = clampedStart > 0;
  const hasNext = clampedStart + PAGE_SIZE < total;
  const rangeStart = total === 0 ? 0 : clampedStart + 1;
  const rangeEnd = Math.min(clampedStart + PAGE_SIZE, total);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [windowStart, isMobile]);

  return (
    <main id="top">
      {/* Get to the point: ask for investable assets immediately */}
      <section
        id="explore"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-6 sm:px-6 sm:pt-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          {/* <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <PiggyBank aria-hidden="true" className="h-6 w-6" />
          </span> */}
          <h1 className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            See where you can retire
          </h1>
        </div>

        <div className="mt-6">
          <FilterPanel
            investableAssets={investableAssets}
            monthlyIncome={monthlyIncome}
            currency={currency}
            withdrawalRate={withdrawalRate}
            monthlyBudgetUsd={budgetUsd}
            region={region}
            availableRegions={availableRegions}
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
            onSearchChange={setSearchQuery}
            onToggleTag={toggleTag}
            onClearTags={() => setSelectedTags([])}
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
            <div ref={listTopRef}>
              {hasPrev && (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSlideDir("prev");
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
              {displayedCities.map((item) => {
                return (
                  <li key={item.key} className="h-full">
                    <CityCard
                      city={item.city}
                      budgetUsd={budgetUsd}
                      currency={currency}
                      people={householdSize}
                      pinned={pinned.includes(item.key)}
                      allowPin={!pinned.includes(item.key) && pinned.length < MAX_COMPARE}
                      onTogglePin={() => togglePin(item.key)}
                      onSelect={() => setSelectedCityKey(item.key)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
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
              Try raising your budget or widening the region or tag filters.
            </p>
          </div>
        )}


        {hasNext && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                trackPagination(
                  Math.floor(clampedStart / PAGE_SIZE) + 2,
                  filteredCities.length
                );
                setSlideDir("next");
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

      <section
        id="about"
        className="mx-auto max-w-6xl scroll-mt-20 border-t border-sand bg-white/70 px-4 py-16 sm:px-6"
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
            About me
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Built by a single person for dignified retirement.
          </h2>
          <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
            This is an independent effort to help people choose a retirement city that
            lets them stretch savings, preserve dignity, and avoid running out of
            money. I built this tool to make retirement planning more transparent,
            more realistic, and more focused on living well without exhausting
            assets.
          </p>
          <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
            If you have an idea for an improvement, please request a feature so I
            can keep shaping the experience around what matters most: peace of mind,
            affordable living, and a retirement plan that feels sustainable.
          </p>
        </div>
      </section>

      <footer className="border-t border-sand bg-sand/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted sm:px-6">
          Estimates only. Not financial advice.
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
              onClick={() => {
                trackComparePanel("open");
                setCompareOpen(true);
              }}
              disabled={pinnedCities.length < 2}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Scale aria-hidden="true" className="h-4 w-4" />
              Compare
            </button>
            <button
              type="button"
              onClick={() => {
                trackClearFilters();
                setPinned([]);
              }}
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
          cities={pinnedCities.slice(0, MAX_COMPARE)}
          currency={currency}
          budgetUsd={budgetUsd}
          people={householdSize}
          onClose={() => setCompareOpen(false)}
          onUnpin={handleUnpin}
        />
      )}
      {selectedCity && (
        <CityModal
          city={selectedCity}
          open={true}
          onClose={() => setSelectedCityKey(null)}
        />
      )}
    </main>
  );
}
