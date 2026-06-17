import type { City } from "@/data/cities";

// Amenity value of each tag (how much it lifts a city's score).
const TAG_WEIGHTS: Record<string, number> = {
  Healthcare: 0.7,
  Safety: 0.7,
  "Low Cost": 0.6,
  "Lower Cost": 0.6,
  "Great Weather": 0.6,
  Walkable: 0.6,
  "Expat Friendly": 0.5,
  Beach: 0.5,
  Culture: 0.5,
  Food: 0.5,
  Nature: 0.5,
  Transit: 0.5,
  Coastal: 0.4,
  Modern: 0.4,
  Music: 0.4,
  Warm: 0.3,
  Nightlife: 0.3,
  Skiing: 0.3,
  Golf: 0.3,
  Premium: 0.3,
};

const DEFAULT_TAG_WEIGHT = 0.3;

/**
 * A single, common 0–10 "livability" score for every city (one decimal).
 * Deterministic from the city's own data:
 *   rating = 4 (baseline) + amenities (sum of tag weights) + value (cheaper
 *   cities score a bit higher), clamped to 0–10.
 * Intrinsic to the city — independent of the user's budget or household size.
 */
export function cityRating(city: City): number {
  const amenity = city.tags.reduce(
    (sum, tag) => sum + (TAG_WEIGHTS[tag] ?? DEFAULT_TAG_WEIGHT),
    0
  );
  // Affordability/value: cheaper places get a lift, pricey ones a small ding.
  const value = Math.max(-0.5, Math.min(2, 2 - city.monthlyCost / 3000));
  const raw = 4 + amenity + value;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}
