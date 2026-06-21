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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const datasets = [
  {
    file: "data/asia_part1_retirement_cities.json",
    source: "asia-part-1",
    idOffset: 100000,
  },
  {
    file: "data/asia_part2_retirement_cities.json",
    source: "asia-part-2",
    idOffset: 200000,
  },
  {
    file: "data/africa_retirement_cities.json",
    source: "africa",
    idOffset: 300000,
  },
  {
    file: "data/europe_cities_part2.json",
    source: "europe-part-2",
    idOffset: 400000,
  },
];

function normalizeCities(dataset) {
  if (Array.isArray(dataset.cities)) {
    return dataset.cities;
  }

  if (Array.isArray(dataset)) {
    return dataset;
  }

  return [];
}

function mapCityToRow(city, source, idOffset) {
  const sourceId = Number.isInteger(city.id) ? city.id + idOffset : idOffset;

  return {
    source,
    source_id: sourceId,
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
  };
}

async function seedDataset(dataset) {
  const datasetPath = resolve(process.cwd(), dataset.file);
  console.log(`\nLoading dataset ${dataset.file}...`);

  const fileContents = await readFile(datasetPath, "utf8");
  const parsed = JSON.parse(fileContents);
  const cities = normalizeCities(parsed);

  if (cities.length === 0) {
    console.error(`No cities found in ${dataset.file}`);
    process.exit(1);
  }

  console.log(`Found ${cities.length} cities in ${dataset.file}`);
  console.log(`Deleting existing cities for source: ${dataset.source}...`);

  const { error: deleteError } = await supabase
    .from("retirement_cities")
    .delete()
    .eq("source", dataset.source);

  if (deleteError) {
    console.error("Delete failed:", deleteError.message);
    process.exit(1);
  }

  const rows = cities.map((city) => mapCityToRow(city, dataset.source, dataset.idOffset));
  console.log(`Inserting ${rows.length} rows for source: ${dataset.source}...`);

  const { error: insertError } = await supabase.from("retirement_cities").insert(rows);

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    process.exit(1);
  }

  console.log(`✓ Seeded ${rows.length} retirement city records from source: ${dataset.source}`);
}

async function main() {
  for (const dataset of datasets) {
    await seedDataset(dataset);
  }

  console.log("\n✓ All datasets seeded successfully.");
}

await main();
