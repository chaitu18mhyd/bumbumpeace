import { cities, type City } from "@/data/cities";

/**
 * City data for the page. The dataset lives in `data/cities.ts` and is read
 * directly (server-side) for the website. The same data is also exposed as a
 * JSON API at `/api/cities` for external clients (e.g. a future mobile app).
 */
export async function getCities(): Promise<{ cities: City[] }> {
  return { cities };
}
