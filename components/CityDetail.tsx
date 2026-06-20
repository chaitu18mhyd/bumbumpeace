import { type City } from "@/data/cities";
import { type CurrencyCode, formatUsdAs } from "@/lib/currency";
import { expenseBreakdown } from "@/lib/expenses";

type CityDetailProps = {
  city: City;
  currency: CurrencyCode;
  people: number;
};

// SVG canvas geometry. The chart scales responsively via the viewBox.
const SIZE = 420;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 200;
const LABEL_R = R * 0.62;
const COORD_PRECISION = 4;

function formatCoord(value: number) {
  return value.toFixed(COORD_PRECISION);
}

function polar(radius: number, fraction: number): [number, number] {
  const angle = (fraction * 360 - 90) * (Math.PI / 180);
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

export default function CityDetail({
  city,
  currency,
  people,
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
    const path = `M ${formatCoord(CX)} ${formatCoord(CY)} L ${formatCoord(x1)} ${formatCoord(y1)} A ${formatCoord(R)} ${formatCoord(R)} 0 ${largeArc} 1 ${formatCoord(x2)} ${formatCoord(y2)} Z`;
    const [lx, ly] = polar(LABEL_R, start + slice.pct / 2);

    return {
      ...slice,
      path,
      lx: formatCoord(lx),
      ly: formatCoord(ly),
      showAmount: slice.pct >= 0.1,
    };
  });

  const ariaLabel = `Expense breakdown for ${city.city}: ${slices
    .map((s) => `${s.label} ${Math.round(s.pct * 100)} percent`)
    .join(", ")}`;

  return (
    <section
      id="city-detail-panel"
      aria-label={`Estimated monthly expense breakdown for ${city.city}`}
      className="relative mt-0 scroll-mt-24"
    >
      {/* Full pie chart with inside-slice labels (hand-built SVG, no library) */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto mt-3 w-full max-w-md"
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
                  <tspan x={seg.lx} dy="-0.55em" fontSize="18" fontWeight="700">
                    {seg.label}
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.3em"
                    fontSize="13"
                    fontWeight="700"
                  >
                    {Math.round(seg.pct * 100)}%
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.3em"
                    fontSize="14"
                    fontWeight="600"
                    opacity="0.95"
                  >
                    {formatUsdAs(seg.amountUsd, currency)}
                  </tspan>
                </>
              ) : (
                <>
                  <tspan x={seg.lx} dy="-0.1em" fontSize="15" fontWeight="700">
                    {seg.label}
                  </tspan>
                  <tspan
                    x={seg.lx}
                    dy="1.3em"
                    fontSize="12"
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

    </section>
  );
}
