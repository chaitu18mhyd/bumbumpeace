import { X } from "lucide-react";
import { type City } from "@/data/cities";

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
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-ink">{city.city}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sand bg-white text-muted"
            aria-label="Close details"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm text-ink">
          <div>
            <p className="text-xs font-semibold uppercase text-muted">Language</p>
            <p className="mt-2">{city.language ?? "Not available"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted">Popular neighborhoods</p>
            {city.popularNeighborhoods && city.popularNeighborhoods.length > 0 ? (
              <ul className="mt-2 list-disc pl-5">
                {city.popularNeighborhoods.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">Not available</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted">Visa</p>
            <p className="mt-2">{city.visaNotes ?? "Not available"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted">Health care</p>
            <p className="mt-2">{city.healthcareNotes ?? "Not available"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted">Best for</p>
            {city.bestFor && city.bestFor.length > 0 ? (
              <ul className="mt-2 list-disc pl-5">
                {city.bestFor.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">Not available</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted">Avoid if</p>
            {city.avoidIf && city.avoidIf.length > 0 ? (
              <ul className="mt-2 list-disc pl-5">
                {city.avoidIf.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">Not available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
