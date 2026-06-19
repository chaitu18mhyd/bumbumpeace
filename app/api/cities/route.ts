import { fetchCitiesFromDatabase } from "@/lib/retirementCities";

// Public JSON API for city data backed by Supabase.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const lifestyle = searchParams.get("lifestyle");

  const { data } = await fetchCitiesFromDatabase({ region, lifestyle });
  if (data !== null) {
    return Response.json({ count: data.length, cities: data });
  }

  return Response.json(
    { error: "City dataset unavailable from database." },
    { status: 500 }
  );
}
