"use client";

import { useMemo, useState } from "react";
import CityCard from "@/components/CityCard";
import FilterPanel, {
  type LifestyleFilter,
  type RegionFilter,
} from "@/components/FilterPanel";
import { cities } from "@/data/cities";

const DEFAULT_NET_WORTH = 1_200_000;
const DEFAULT_WITHDRAWAL_RATE = 0.04;

export default function Home() {
  const [netWorth, setNetWorth] = useState<number>(DEFAULT_NET_WORTH);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(
    DEFAULT_WITHDRAWAL_RATE
  );
  const [region, setRegion] = useState<RegionFilter>("All");
  const [lifestyle, setLifestyle] = useState<LifestyleFilter>("All");
  const [onlyUnderBudget, setOnlyUnderBudget] = useState<boolean>(false);

  const safeNetWorth = Number.isFinite(netWorth) ? Math.max(netWorth, 0) : 0;
  const safeBudget = Math.round((safeNetWorth * withdrawalRate) / 12);

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      if (region !== "All" && city.region !== region) return false;
      if (lifestyle !== "All" && city.lifestyle !== lifestyle) return false;
      if (onlyUnderBudget && city.monthlyCost > safeBudget) return false;
      return true;
    });
  }, [region, lifestyle, onlyUnderBudget, safeBudget]);

  const underBudgetCount = useMemo(
    () => filteredCities.filter((city) => city.monthlyCost <= safeBudget).length,
    [filteredCities, safeBudget]
  );

  return (
    <main id="top">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-cream to-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-under-100/50 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Retirement city explorer
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
            Find Cities Where Your Retirement Money Goes Further
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Compare estimated monthly retirement expenses across popular cities
            and countries.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href="#explore"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Explore Cities
            </a>
            <p className="text-xs text-muted">
              Prototype estimates only — not financial advice.
            </p>
          </div>
        </div>
      </header>

      {/* Explore section */}
      <section
        id="explore"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 pt-6 sm:px-6 sm:pt-10"
      >
        <FilterPanel
          netWorth={netWorth}
          withdrawalRate={withdrawalRate}
          monthlyBudget={safeBudget}
          region={region}
          lifestyle={lifestyle}
          onlyUnderBudget={onlyUnderBudget}
          onNetWorthChange={setNetWorth}
          onWithdrawalRateChange={setWithdrawalRate}
          onRegionChange={setRegion}
          onLifestyleChange={setLifestyle}
          onOnlyUnderBudgetChange={setOnlyUnderBudget}
        />

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
            {filteredCities.map((city) => (
              <li key={`${city.city}-${city.country}`} className="h-full">
                <CityCard city={city} budget={safeBudget} />
              </li>
            ))}
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
      </section>

      <footer className="border-t border-sand bg-sand/40">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted sm:px-6">
          RetireWell · Prototype with mock data · Estimates only — not financial
          advice.
        </div>
      </footer>
    </main>
  );
}
