import { MapPin, Pin, Star } from "lucide-react";
import CityDetail from "@/components/CityDetail";
import { displayCountry, displayRegion, type City, flagFor } from "@/data/cities";
import { type CurrencyCode, formatUsdAs } from "@/lib/currency";
import { scaledMonthlyCost } from "@/lib/expenses";
import { cityRating } from "@/lib/rating";

function ratingClasses(rating: number): string {
  if (rating >= 8) return "bg-under-100 text-under-700";
  if (rating >= 6.5) return "bg-brand-100 text-brand-700";
  return "bg-sand text-muted";
}

type CityCardProps = {
  city: City;
  budgetUsd: number;
  currency: CurrencyCode;
  people: number;
  pinned: boolean;
  allowPin: boolean;
  onTogglePin: () => void;
};



export default function CityCard({
  city,
  budgetUsd,
  currency,
  people,
  pinned,
  allowPin,
  onTogglePin,
}: CityCardProps) {
  const countryLabel = displayCountry(city.country);
  const regionLabel = displayRegion(city.region);
  const cost = scaledMonthlyCost(city.monthlyCost, city.expenseShares, people);
  const isUnderBudget = cost <= budgetUsd;
  const differenceUsd = Math.abs(cost - budgetUsd);
  const rating = cityRating(city);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-sand bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/${flagFor(city.country).toLowerCase()}.svg`}
            alt={`Flag of ${city.country}`}
            className="h-6 w-8 rounded-sm flex-shrink-0"
          />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {city.city}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {countryLabel} · {regionLabel}
              </span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            aria-pressed={pinned}
            aria-label={
              pinned ? `Unpin ${city.city}` : `Pin ${city.city} to compare`
            }
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              pinned
                ? "border-brand-400 bg-brand-500 text-white"
                : "border-sand bg-white text-muted hover:bg-sand hover:text-ink"
            } ${!allowPin && !pinned ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={!allowPin && !pinned}
          >
            <Pin
              aria-hidden="true"
              className={`h-4 w-4 ${pinned ? "fill-current" : ""}`}
            />
          </button>
          {/* Budget badge disabled for now; show later when ready */}
          <div className="h-7" />
        </div>
      </header>

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tracking-tight text-ink sm:text-[2rem]">
            {formatUsdAs(cost, currency)}
            <span className="ml-1 text-sm font-medium text-muted">/mo</span>
          </p>
          <p
            className={`mt-1 text-xs font-medium ${
              isUnderBudget ? "text-under-700" : "text-over-700"
            }`}
          >
            {isUnderBudget
              ? `${formatUsdAs(differenceUsd, currency)} under your budget`
              : `${formatUsdAs(differenceUsd, currency)} over your budget`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-3xl font-bold ${ratingClasses(
              rating
            )}`}
            aria-label={`Rating ${rating} out of 10`}
          >
            <Star aria-hidden="true" className="h-5 w-5 fill-current" />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        {city.description}
      </p>

      <ul className="mt-auto flex flex-nowrap gap-2 overflow-x-auto pt-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {city.tags.map((tag) => (
          <li
            key={tag}
            className="shrink-0 whitespace-nowrap rounded-full bg-[var(--color-tag)] px-2.5 py-1 text-xs font-medium text-ink/70"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-0">
        <CityDetail city={city} currency={currency} people={people} />
      </div>
    </article>
  );
}
