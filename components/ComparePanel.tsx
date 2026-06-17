"use client";

import { ArrowUp, Check, X } from "lucide-react";
import { type City, flagFor } from "@/data/cities";
import { type CurrencyCode, formatUsdAs } from "@/lib/currency";
import { expenseBreakdown } from "@/lib/expenses";

type ComparePanelProps = {
  cities: City[];
  currency: CurrencyCode;
  budgetUsd: number;
  onClose: () => void;
  onUnpin: (city: City) => void;
};

export default function ComparePanel({
  cities,
  currency,
  budgetUsd,
  onClose,
  onUnpin,
}: ComparePanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare cities"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
      >
        <header className="flex items-center justify-between border-b border-sand px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight text-ink">
            Compare cities
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sand bg-white text-muted transition hover:bg-sand hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </header>

        <div className="overflow-auto p-5">
          <div className="flex gap-4">
            {cities.map((city) => {
              const isUnder = city.monthlyCost <= budgetUsd;
              const slices = expenseBreakdown(city.monthlyCost, city.expenseShares);
              return (
                <div
                  key={`${city.city}-${city.country}`}
                  className="flex w-60 shrink-0 flex-col rounded-2xl border border-sand bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        role="img"
                        aria-label={`Flag of ${city.country}`}
                        className="text-2xl leading-none"
                      >
                        {flagFor(city.country)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-ink">
                          {city.city}
                        </h3>
                        <p className="truncate text-xs text-muted">
                          {city.country} · {city.region}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUnpin(city)}
                      aria-label={`Remove ${city.city} from comparison`}
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-sand hover:text-ink"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
                    {formatUsdAs(city.monthlyCost, currency)}
                    <span className="ml-1 text-xs font-medium text-muted">
                      /mo
                    </span>
                  </p>

                  <span
                    className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isUnder
                        ? "bg-under-100 text-under-700"
                        : "bg-over-100 text-over-700"
                    }`}
                  >
                    {isUnder ? (
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {isUnder ? "Under budget" : "Over budget"}
                  </span>

                  <dl className="mt-3 space-y-1 border-t border-sand pt-3 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Lifestyle</dt>
                      <dd className="font-medium text-ink">{city.lifestyle}</dd>
                    </div>
                    {slices.map((s) => (
                      <div key={s.label} className="flex justify-between gap-2">
                        <dt className="flex items-center gap-1.5 text-muted">
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label}
                        </dt>
                        <dd className="font-medium text-ink">
                          {formatUsdAs(s.amountUsd, currency)}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {city.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-ink/70"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
