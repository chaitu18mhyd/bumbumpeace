import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);;
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

console.log("Setting up retirement_cities table schema...");

// Use Supabase's REST API to execute raw SQL
const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  },
  body: JSON.stringify({
    query: `
      ALTER TABLE retirement_cities
      ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'retirement-cities.seed';
      
      ALTER TABLE retirement_cities
      ADD COLUMN IF NOT EXISTS source_id INTEGER;
    `,
  }),
});

if (!response.ok) {
  // If the RPC doesn't exist, just show instructions for manual setup
  console.log("ℹ️  Automated schema setup not available.");
  console.log("Please run the following SQL in Supabase SQL Editor:");
  console.log("");
  console.log(`
    ALTER TABLE retirement_cities
    ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'retirement-cities.seed';
    
    ALTER TABLE retirement_cities
    ADD COLUMN IF NOT EXISTS source_id INTEGER;
  `);
  console.log("");
  console.log("Then re-run the seed scripts.");
  process.exit(1);
}

console.log("✓ Schema setup complete. The 'source' and 'source_id' columns are ready.");
