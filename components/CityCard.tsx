import { type City, flagFor } from "@/data/cities";
import { formatUSD } from "@/lib/format";

type CityCardProps = {
  city: City;
  budget: number;
};

const lifestyleStyles: Record<City["lifestyle"], string> = {
  Lean: "bg-brand-100 text-brand-700",
  Comfortable: "bg-brand-200 text-brand-700",
  Premium: "bg-brand-300 text-brand-700",
};

export default function CityCard({ city, budget }: CityCardProps) {
  const isUnderBudget = city.monthlyCost <= budget;
  const difference = Math.abs(city.monthlyCost - budget);

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-sand bg-white p-5 shadow-sm ring-1 ring-black/[0.03] transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            role="img"
            aria-label={`Flag of ${city.country}`}
            className="mt-0.5 shrink-0 text-2xl leading-none sm:text-3xl"
          >
            {flagFor(city.country)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-ink sm:text-xl">
              {city.city}
            </h3>
            <p className="mt-0.5 text-sm text-muted">
              {city.country} · {city.region}
            </p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isUnderBudget
              ? "bg-under-100 text-under-700"
              : "bg-over-100 text-over-700"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              isUnderBudget ? "bg-under-600" : "bg-over-600"
            }`}
          />
          {isUnderBudget ? "Under budget" : "Over budget"}
        </span>
      </header>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold tracking-tight text-ink sm:text-[2rem]">
            {formatUSD(city.monthlyCost)}
            <span className="ml-1 text-sm font-medium text-muted">/mo</span>
          </p>
          <p
            className={`mt-1 text-xs font-medium ${
              isUnderBudget ? "text-under-700" : "text-over-700"
            }`}
          >
            {isUnderBudget
              ? `${formatUSD(difference)} under your budget`
              : `${formatUSD(difference)} over your budget`}
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

      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
        {city.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-ink/70"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
