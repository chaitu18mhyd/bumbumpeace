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

function normalizeKey(city, country) {
  const normalize = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  return `${normalize(city)}|${normalize(country)}`;
}

async function main() {
  const datasetPath = resolve(process.cwd(), "data/cities_by_recommendation_rank.json");
  const raw = await readFile(datasetPath, "utf8");
  const dataset = JSON.parse(raw);

  if (!Array.isArray(dataset)) {
    console.error("Expected data/cities_by_recommendation_rank.json to contain an array.");
    process.exit(1);
  }

  const rankLookup = new Map(
    dataset
      .filter(
        (entry) => entry?.city && entry?.country && Number.isFinite(entry.recommendationRank)
      )
      .map((entry) => [normalizeKey(entry.city, entry.country), entry.recommendationRank])
  );

  if (rankLookup.size === 0) {
    console.error("No recommendation rank entries found in the dataset.");
    process.exit(1);
  }

  console.log(`Loaded ${rankLookup.size} recommendation rank entries.`);

  const { data: rows, error: selectError } = await supabase
    .from("retirement_cities")
    .select("id,city,country,recommendation_rank");

  if (selectError) {
    console.error("Failed to load retirement_cities:", selectError.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.error("No retirement_cities rows found in the database.");
    process.exit(1);
  }

  const updates = [];
  const missing = [];

  for (const row of rows) {
    const key = normalizeKey(row.city, row.country);
    const rank = rankLookup.get(key);

    if (rank == null) {
      missing.push({ city: row.city, country: row.country });
      continue;
    }

    if (row.recommendation_rank !== rank) {
      updates.push({ id: row.id, recommendation_rank: rank });
    }
  }

  if (updates.length === 0) {
    console.log("No recommendation_rank updates required.");
  } else {
    console.log(`Updating recommendation_rank on ${updates.length} rows...`);

    for (const update of updates) {
      const { error } = await supabase
        .from("retirement_cities")
        .update({ recommendation_rank: update.recommendation_rank })
        .eq("id", update.id);

      if (error) {
        console.error("Update failed for row ID", update.id, error.message);
        process.exit(1);
      }
    }

    console.log(`✓ Updated recommendation_rank for ${updates.length} rows.`);
  }

  if (missing.length > 0) {
    console.warn(`Warning: ${missing.length} rows did not match any recommendation rank entry.`);
    missing.slice(0, 20).forEach((row) => {
      console.warn(`  - ${row.city}, ${row.country}`);
    });
    if (missing.length > 20) {
      console.warn(`  ...and ${missing.length - 20} more.`);
    }
    console.warn(
      "If the city names or countries differ between the database and JSON file, update the source names or the ranking JSON."
    );
  }

  console.log("Done.");
}

await main();
