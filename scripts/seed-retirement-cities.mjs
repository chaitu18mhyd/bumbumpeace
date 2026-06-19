import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const datasetPath = resolve(process.cwd(), "data/retirement-cities.seed.json");
const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
const cities = Array.isArray(dataset.cities) ? dataset.cities : [];

if (cities.length === 0) {
  console.error("No cities found in data/retirement-cities.seed.json");
  process.exit(1);
}

const rows = cities.map((city) => ({
  source_id: city.id,
  city: city.city,
  country: city.country,
  region: city.region,
  subregion: city.subregion ?? null,
  latitude: city.latitude ?? null,
  longitude: city.longitude ?? null,
  monthly_cost_usd: city.monthly_cost_usd,
  lifestyle_label: city.lifestyle_label,
  description: city.description,
  tags: city.tags ?? [],
  visa_ease_score: city.visa_ease_score ?? null,
  healthcare_score: city.healthcare_score ?? null,
  safety_score: city.safety_score ?? null,
  climate_score: city.climate_score ?? null,
  expat_community_score: city.expat_community_score ?? null,
  internet_score: city.internet_score ?? null,
  overall_retirement_score: city.overall_retirement_score ?? null,
  climate_type: city.climate_type ?? null,
  language: city.language ?? null,
  currency: city.currency ?? null,
  time_zone: city.time_zone ?? null,
  popular_neighborhoods: city.popular_neighborhoods ?? [],
  visa_notes: city.visa_notes ?? null,
  healthcare_notes: city.healthcare_notes ?? null,
  best_for: city.best_for ?? [],
  avoid_if: city.avoid_if ?? [],
  expense_shares: city.expense_shares ?? null,
}));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const { error } = await supabase.from("retirement_cities").upsert(rows, {
  onConflict: "source_id",
});

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} retirement city records.`);
