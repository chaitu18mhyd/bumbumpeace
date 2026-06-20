import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seedLatinAmericaCities() {
  try {
    console.log('Fetching existing cities from database...');
    const { data: existingCities, error: fetchError } = await supabase
      .from('retirement_cities')
      .select('city, country');

    if (fetchError) {
      console.error('❌ Error fetching existing cities:', fetchError.message);
      process.exit(1);
    }

    // Build a Set of existing city|country combinations
    const existingSet = new Set(
      existingCities.map((c) => `${c.city}|${c.country}`)
    );

    // Read the Latin America cities JSON file
    const filePath = './data/latin_america_100_cities.json';
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileData = JSON.parse(fileContent);
    const inputCities = fileData.cities || [];

    console.log(`Found ${inputCities.length} cities in file.`);
    console.log(`${existingCities.length} cities already exist in database.`);

    // Filter to only new cities
    const newCities = inputCities.filter(
      (city) => !existingSet.has(`${city.city}|${city.country}`)
    );

    const duplicateCount = inputCities.length - newCities.length;
    console.log(`${duplicateCount} cities are duplicates.`);
    console.log(`${newCities.length} new cities will be inserted.`);

    if (newCities.length === 0) {
      console.log('✓ No new cities to insert.');
      return;
    }

    // Map to database schema
    const citiesToInsert = newCities.map((city) => ({
      source: 'latin-america-part-1',
      source_id: city.id,
      city: city.city,
      country: city.country,
      region: city.region,
      subregion: city.subregion || null,
      latitude: city.latitude || null,
      longitude: city.longitude || null,
      monthly_cost_usd: city.monthly_cost_usd,
      lifestyle_label: city.lifestyle_label,
      description: city.description,
      tags: city.tags || [],
      visa_ease_score: city.visa_ease_score || null,
      healthcare_score: city.healthcare_score || null,
      safety_score: city.safety_score || null,
      climate_score: city.climate_score || null,
      expat_community_score: city.expat_community_score || null,
      internet_score: city.internet_score || null,
      overall_retirement_score: city.overall_retirement_score || null,
      climate_type: city.climate_type || null,
      language: city.language || null,
      currency: city.currency || null,
      time_zone: city.time_zone || null,
      popular_neighborhoods: city.popular_neighborhoods || [],
      visa_notes: city.visa_notes || null,
      healthcare_notes: city.healthcare_notes || null,
      best_for: city.best_for || [],
      avoid_if: city.avoid_if || [],
      expense_shares: city.expense_shares || {},
    }));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < citiesToInsert.length; i += batchSize) {
      const batch = citiesToInsert.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('retirement_cities')
        .insert(batch);

      if (insertError) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, insertError.message);
        process.exit(1);
      }

      console.log(`✓ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} cities)`);
    }

    console.log(`\n✓ Successfully seeded ${newCities.length} Latin America cities from source: latin-america-part-1`);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

seedLatinAmericaCities();
