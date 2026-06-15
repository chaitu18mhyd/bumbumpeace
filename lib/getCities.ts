import { cities as fallbackCities, type City } from "@/data/cities";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

type CitiesResponse = { count: number; cities: City[] };

/**
 * Server-side fetch of the city list from the Go API (bumbumpeace-api).
 * Falls back to the bundled mock data if the API is unreachable so the site
 * still renders during local development or an API outage.
 */
export async function getCities(): Promise<{ cities: City[]; source: "api" | "fallback" }> {
  try {
    const res = await fetch(`${API_URL}/cities`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API responded ${res.status}`);

    const data = (await res.json()) as Partial<CitiesResponse>;
    if (!Array.isArray(data.cities) || data.cities.length === 0) {
      throw new Error("API returned no cities");
    }
    return { cities: data.cities, source: "api" };
  } catch (err) {
    console.warn(
      `[getCities] using fallback mock data (${(err as Error).message})`
    );
    return { cities: fallbackCities, source: "fallback" };
  }
}
