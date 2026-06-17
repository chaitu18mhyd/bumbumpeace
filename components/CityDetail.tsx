import { X } from "lucide-react";
import { type City, flagFor } from "@/data/cities";
import { type CurrencyCode, formatUsdAs } from "@/lib/currency";
import { expenseBreakdown } from "@/lib/expenses";

type CityDetailProps = {
  city: City;
  currency: CurrencyCode;
  people: number;
  caretLeft: number | null;
  onClose: () => void;
};

// SVG canvas geometry. The chart scales responsively via the viewBox.
const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 170;
const LABEL_R = R * 0.62;

function polar(radius: number, fraction: number): [number, number] {
  const angle = (fraction * 360 - 90) * (Math.PI / 180);
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

export default function CityDetail({
  city,
  currency,
  people,
  caretLeft,
  onClose,
}: CityDetailProps) {
  const slices = expenseBreakdown(city.monthlyCost, city.expenseShares, people);
  const totalUsd = slices.reduce((sum, s) => sum + s.amountUsd, 0);

  // Build full-pie wedge paths + centroid label positions.
  let cumulative = 0;
  const segments = slices.map((slice) => {
    const start = cumulative;
    const end = cumulative + slice.pct;
    cumulative = end;

    const [x1, y1] = polar(R, start);
    const [x2, y2] = polar(R, end);
    const largeArc = slice.pct > 0.5 ? 1 : 0;
    const path = `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const [lx, ly] = polar(LABEL_R, start + slice.pct / 2);

    return { ...slice, path, lx, ly, showAmount: slice.pct >= 0.1 };
  });

  const ariaLabel = `Expense breakdown for ${city.city}: ${slices
    .map((s) => `${s.label} ${Math.round(s.pct * 100)} percent`)
    .join(", ")}`;

  return (
    <section
      id="city-detail-panel"
      aria-label={`Estimated monthly expense breakdown for ${city.city}`}
      className="relative mt-8 scroll-mt-24 rounded-3xl border border-sand bg-white p-5 shadow-sm ring-1 ring-black/[0.03] sm:p-7"
    >
      {caretLeft !== null && (
        <span
          aria-hidden="true"
          style={{ left: caretLeft - 7 }}
          className="absolute -top-[7px] z-10 h-3.5 w-3.5 rotate-45 border-l border-t border-sand bg-white"
        />
      )}

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            role="img"
            aria-label={`Flag of ${city.country}`}
            className="text-2xl leading-none sm:text-3xl"
          >
            {flagFor(city.country)}
          </span>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-ink sm:text-xl">
              {city.city}
            </h3>
            <p className="text-sm text-muted">
              Estimated monthly expenses ·{" "}
              <span className="font-semibold text-ink">
                {formatUsdAs(totalUsd, currency)}/mo
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close expense breakdown"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand bg-cream text-muted transition hover:bg-sand hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </header>

      {/* Full pie chart with inside-slice labels (hand-built SVG, no library) */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto mt-4 w-full max-w-md"
      >
        {segments.map((seg) => (
          <path
            key={`slice-${seg.label}`}
            d={seg.path}
            fill={seg.color}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {segments.map((seg) => {
          const textColor = seg.dark ? "#1f2937" : "#ffffff";
          return (
            <text
              key={`label-${seg.label}`}
              x={seg.lx}
              y={seg.ly}
              textAnchor="middle"
              fill={textColor}
            >
              {seg.showAmount ? (
                <>
                  <tspan x={seg.lx} dy="-0.55em" fontSize="15" fontWeight="700">
                    {seg.label}
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.25em"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {Math.round(seg.pct * 100)}%
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.25em"
                    fontSize="12"
                    fontWeight="600"
                    opacity="0.9"
                  >
                    {formatUsdAs(seg.amountUsd, currency)}
                  </tspan>
                </>
              ) : (
                <>
                  <tspan x={seg.lx} dy="-0.1em" fontSize="12" fontWeight="700">
                    {seg.label}
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.2em"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {Math.round(seg.pct * 100)}%
                  </tspan>
                </>
              )}
            </text>
          );
        })}
      </svg>

      <p className="mt-4 text-center text-xs text-muted">
        Illustrative breakdown using sample category percentages — not actual
        local prices.
      </p>
    </section>
  );
}
