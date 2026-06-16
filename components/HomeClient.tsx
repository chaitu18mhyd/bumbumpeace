"use client";

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
import FilterPanel, {
  type LifestyleFilter,
  type RegionFilter,
} from "@/components/FilterPanel";
import type { City } from "@/data/cities";
import { type CurrencyCode, toUsd, usdTo } from "@/lib/currency";

const DEFAULT_INVESTABLE_ASSETS = 1_200_000;
const DEFAULT_WITHDRAWAL_RATE = 0.04;
const PAGE_SIZE = 3;

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
  const [onlyUnderBudget, setOnlyUnderBudget] = useState<boolean>(false);

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

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      if (region !== "All" && city.region !== region) return false;
      if (lifestyle !== "All" && city.lifestyle !== lifestyle) return false;
      if (onlyUnderBudget && city.monthlyCost > budgetUsd) return false;
      return true;
    });
  }, [cities, region, lifestyle, onlyUnderBudget, budgetUsd]);

  const underBudgetCount = useMemo(
    () => filteredCities.filter((city) => city.monthlyCost <= budgetUsd).length,
    [filteredCities, budgetUsd]
  );

  // Progressive loading: show a few cities, reveal more on demand.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset back to the first page whenever the filter criteria change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [region, lifestyle, onlyUnderBudget]);

  const visibleCities = filteredCities.slice(0, visibleCount);
  const remaining = filteredCities.length - visibleCities.length;

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
    visibleCount,
    currency,
    investableAssets,
    monthlyIncome,
    withdrawalRate,
    region,
    lifestyle,
    onlyUnderBudget,
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
            onlyUnderBudget={onlyUnderBudget}
            onInvestableAssetsChange={setInvestableAssets}
            onMonthlyIncomeChange={setMonthlyIncome}
            onCurrencyChange={handleCurrencyChange}
            onWithdrawalRateChange={setWithdrawalRate}
            onRegionChange={setRegion}
            onLifestyleChange={setLifestyle}
            onOnlyUnderBudgetChange={setOnlyUnderBudget}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <p
            aria-live="polite"
            className="text-sm font-medium text-ink sm:text-base"
          >
            Showing{" "}
            <span className="font-bold text-brand-700">
              {filteredCities.length}
            </span>{" "}
            {filteredCities.length === 1 ? "city" : "cities"}.{" "}
            <span className="font-bold text-under-700">{underBudgetCount}</span>{" "}
            {underBudgetCount === 1 ? "is" : "are"} under your budget.
          </p>
        </div>

        {filteredCities.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
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
                    selected={
                      selectedCity?.city === city.city &&
                      selectedCity?.country === city.country
                    }
                    onSelect={() => setSelectedCity(city)}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-sand bg-white/60 px-6 py-16 text-center">
            <p className="text-base font-semibold text-ink">
              No cities match your filters
            </p>
            <p className="mt-1 text-sm text-muted">
              Try raising your budget or widening the region and lifestyle
              filters.
            </p>
          </div>
        )}

        <div ref={detailRef}>
          {selectedCity && (
            <CityDetail
              city={selectedCity}
              currency={currency}
              caretLeft={caretLeft}
              onClose={() => setSelectedCity(null)}
            />
          )}
        </div>

        {filteredCities.length > 0 && remaining > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setVisibleCount((c) => c + PAGE_SIZE);
                setSelectedCity(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-brand-300 bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Load more
            </button>
          </div>
        )}
      </section>

      {/* Marketing / context moved below the tool */}
      <section
        id="about"
        className="relative scroll-mt-20 overflow-hidden border-t border-sand bg-gradient-to-b from-cream to-brand-50"
      >
        <div className="relative mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Retirement city explorer
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Find Cities Where Your Retirement Money Goes Further
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Compare estimated monthly retirement expenses across popular cities
            and countries. BumBumSafe turns your investable assets into a
            realistic monthly budget using a safe withdrawal rate, then ranks
            places where
            you can retire comfortably — and with dignity.
          </p>
          <a
            href="#top"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            Back to the calculator
          </a>
        </div>
      </section>

      <footer className="border-t border-sand bg-sand/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted sm:px-6">
          BumBumSafe · Prototype with mock data · Estimates only — not financial
          advice.
        </div>
      </footer>
    </main>
  );
}
