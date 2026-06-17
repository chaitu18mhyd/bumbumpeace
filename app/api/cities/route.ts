import { cities } from "@/data/cities";

// Public JSON API for city data. Used by external clients (e.g. a future mobile
// app); the website itself reads the data module directly. Mirrors the old Go
// API shape: { count, cities } with optional ?region= and ?lifestyle= filters.
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const lifestyle = searchParams.get("lifestyle");

  let result = cities;
  if (region && region.toLowerCase() !== "all") {
    result = result.filter((c) => c.region === region);
  }
  if (lifestyle && lifestyle.toLowerCase() !== "all") {
    result = result.filter((c) => c.lifestyle === lifestyle);
  }

  return Response.json({ count: result.length, cities: result });
}
