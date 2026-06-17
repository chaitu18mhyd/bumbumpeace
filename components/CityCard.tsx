import { ArrowUp, Check, MapPin, Pin } from "lucide-react";
import { type City, flagFor } from "@/data/cities";
import { type CurrencyCode, formatUsdAs } from "@/lib/currency";

type CityCardProps = {
  city: City;
  budgetUsd: number;
  currency: CurrencyCode;
  selected: boolean;
  pinned: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
};

const lifestyleStyles: Record<City["lifestyle"], string> = {
  Lean: "bg-brand-100 text-brand-700",
  Comfortable: "bg-brand-200 text-brand-700",
  Premium: "bg-brand-300 text-brand-700",
};

export default function CityCard({
  city,
  budgetUsd,
  currency,
  selected,
  pinned,
  onSelect,
  onTogglePin,
}: CityCardProps) {
  const isUnderBudget = city.monthlyCost <= budgetUsd;
  const differenceUsd = Math.abs(city.monthlyCost - budgetUsd);

  return (
    <article
      onClick={onSelect}
      className={`group flex h-full cursor-pointer flex-col rounded-3xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg sm:p-6 ${
        selected
          ? "border-brand-400 ring-2 ring-brand-300"
          : "border-sand ring-1 ring-black/[0.03]"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            role="img"
            aria-label={`Flag of ${city.country}`}
            className="mt-0.5 shrink-0 text-2xl leading-none sm:text-3xl"
          >
            {flagFor(city.country)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-ink sm:text-xl">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                aria-expanded={selected}
                aria-controls="city-detail-panel"
                className="rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                {city.city}
              </button>
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {city.country} · {city.region}
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
            }`}
          >
            <Pin
              aria-hidden="true"
              className={`h-4 w-4 ${pinned ? "fill-current" : ""}`}
            />
          </button>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isUnderBudget
                ? "bg-under-100 text-under-700"
                : "bg-over-100 text-over-700"
            }`}
          >
            {isUnderBudget ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            {isUnderBudget ? "Under budget" : "Over budget"}
          </span>
        </div>
      </header>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tracking-tight text-ink sm:text-[2rem]">
            {formatUsdAs(city.monthlyCost, currency)}
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
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            lifestyleStyles[city.lifestyle]
          }`}
        >
          {city.lifestyle}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        {city.description}
      </p>

      <ul className="mt-auto flex flex-nowrap gap-2 overflow-x-auto pt-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {city.tags.map((tag) => (
          <li
            key={tag}
            className="shrink-0 whitespace-nowrap rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-ink/70"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
