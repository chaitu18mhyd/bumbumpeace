import { X } from "lucide-react";
import { type City, displayCountry, flagFor } from "@/data/cities";

type CityModalProps = {
  city: City;
  open: boolean;
  onClose: () => void;
};

export default function CityModal({ city, open, onClose }: CityModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={`More details for ${city.city}`}
      onClick={onClose}
    >
      <div
        className="mx-4 max-w-2xl rounded-2xl bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/${flagFor(
                city.country
              )
                .toLowerCase()
                .replace(" ", "-")}.svg`}
              alt={`Flag of ${city.country}`}
              className="h-6 w-8 rounded-sm flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-ink">{city.city}</h3>
              <p className="mt-0.5 text-sm text-muted truncate">{displayCountry(city.country)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-white text-muted"
            aria-label="Close details"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <hr/>
        <div className="mt-4 space-y-4 text-sm text-ink">
          <DetailItem
            icon={IconLanguage}
            label="Language"
            value={city.language ?? "Not available"}
          />

          <DetailItem
            icon={IconNeighborhoods}
            label="Popular neighborhoods"
            value={
              city.popularNeighborhoods && city.popularNeighborhoods.length > 0 ? (
                <ul className="mt-1 list-disc pl-5">
                  {city.popularNeighborhoods.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : (
                "Not available"
              )
            }
          />

          <DetailItem icon={IconVisa} label="Visa" value={city.visaNotes ?? "Not available"} />

          <DetailItem icon={IconHealthcare} label="Health care" value={city.healthcareNotes ?? "Not available"} />

          <DetailItem
            icon={IconBestFor}
            label="Best for"
            value={
              city.bestFor && city.bestFor.length > 0 ? (
                <ul className="mt-1 list-disc pl-5">
                  {city.bestFor.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                "Not available"
              )
            }
          />

          <DetailItem
            icon={IconAvoid}
            label="Avoid if"
            value={
              city.avoidIf && city.avoidIf.length > 0 ? (
                <ul className="mt-1 list-disc pl-5">
                  {city.avoidIf.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              ) : (
                "Not available"
              )
            }
          />
        </div>
      </div>
    </div>
  );
}


function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: () => JSX.Element;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-white/5">
      <div className="shrink-0 text-black">{Icon()}</div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase text-muted">{label}</div>
        <div className="mt-2 text-sm text-ink">{value}</div>
      </div>
    </div>
  );
}

function IconLanguage() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 4.5c3 3 5 6.5 5 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 19.5c-3-3-5-6.5-5-11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconNeighborhoods() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 21V8a1 1 0 011-1h3l2-2h4l2 2h3a1 1 0 011 1v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconVisa() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 13h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconHealthcare() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconBestFor() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l2.6 5.3L20 8l-4 3.6L17 18l-5-2.6L7 18l1-6.4L4 8l5.4-.7L12 2z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" />
    </svg>
  );
}

function IconAvoid() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}
