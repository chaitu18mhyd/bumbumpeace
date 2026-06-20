import { fetchCitiesFromDatabase } from "@/lib/retirementCities";
import { checkRateLimit } from "@/lib/rateLimit";

// Rate limit: 60 requests per minute per IP
const MAX_REQUESTS_PER_MINUTE = 60;

// Public JSON API for city data backed by Supabase.
export async function GET(request: Request) {
  // Get client IP from headers (works with proxies like Vercel)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  const { allowed, remaining, resetTime } = checkRateLimit(
    ip,
    MAX_REQUESTS_PER_MINUTE
  );

  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    return Response.json(
      {
        error: "Rate limit exceeded. Too many requests.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTime.toString(),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const lifestyle = searchParams.get("lifestyle");

  const { data } = await fetchCitiesFromDatabase({ region, lifestyle });
  if (data !== null) {
    return Response.json(
      { count: data.length, cities: data },
      {
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_MINUTE.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": resetTime.toString(),
        },
      }
    );
  }

  return Response.json(
    { error: "City dataset unavailable from database." },
    { status: 500 }
  );
}
