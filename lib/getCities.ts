import type { City } from "@/data/cities";
import { fetchCitiesFromDatabase } from "@/lib/retirementCities";

/**
 * City data for the page. This app is database-backed and requires Supabase.
 */
export async function getCities(): Promise<{ cities: City[] }> {
  const { data } = await fetchCitiesFromDatabase();
  if (data !== null) {
    return { cities: data };
  }

  throw new Error("Supabase city dataset unavailable.");
}
