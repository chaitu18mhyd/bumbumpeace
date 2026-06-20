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

const datasetPath = resolve(process.cwd(), "data/europe_part_1_60_cities.json");
const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
const cities = Array.isArray(dataset) ? dataset : [];
const source = "europe-part-1";

if (cities.length === 0) {
  console.error("No cities found in data/europe_part_1_60_cities.json");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Fetch all existing cities to check for duplicates
console.log("Fetching existing cities from database...");
const { data: existingCities, error: fetchError } = await supabase
  .from("retirement_cities")
  .select("city, country");

if (fetchError) {
  console.error("Fetch failed:", fetchError.message);
  process.exit(1);
}

// Build a Set of existing city+country combinations for fast lookup
const existingSet = new Set(
  existingCities.map((c) => `${c.city}|${c.country}`)
);

// Filter out duplicates
const newCities = cities.filter(
  (city) => !existingSet.has(`${city.city}|${city.country}`)
);

console.log(`Found ${cities.length} cities in file.`);
console.log(`${existingSet.size} cities already exist in database.`);
console.log(`${newCities.length} new cities will be inserted.`);

if (newCities.length === 0) {
  console.log("No new cities to insert. Exiting.");
  process.exit(0);
}

// Map cities to database schema
const rows = newCities.map((city) => ({
  source,
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

// Insert new cities
console.log(`Inserting ${rows.length} new cities...`);
const { error: insertError } = await supabase
  .from("retirement_cities")
  .insert(rows);

if (insertError) {
  console.error("Insert failed:", insertError.message);
  process.exit(1);
}

console.log(`✓ Successfully seeded ${rows.length} Europe cities from source: ${source}`);
