import type { City, Lifestyle, Region } from "@/data/cities";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type RetirementCityRow = {
  city: string;
  country: string;
  region: string;
  monthly_cost_usd: number;
  lifestyle_label: string;
  description: string;
  tags: string[] | null;
  expense_shares: Record<string, number> | null;
  language?: string | null;
  popular_neighborhoods?: string[] | null;
  visa_notes?: string | null;
  healthcare_notes?: string | null;
  best_for?: string[] | null;
  avoid_if?: string[] | null;
  recommendation_rank?: number | null;
};

const REGION_SET = new Set<Region>([
  "North America",
  "Europe",
  "Latin America",
  "Asia",
  "Middle East",
  "Oceania",
  "Africa",
]);

const LIFESTYLE_SET = new Set<Lifestyle>(["Lean", "Comfortable", "Premium"]);

function normalizeRegion(value: string): Region {
  return REGION_SET.has(value as Region) ? (value as Region) : "Asia";
}

function normalizeLifestyle(value: string): Lifestyle {
  return LIFESTYLE_SET.has(value as Lifestyle)
    ? (value as Lifestyle)
    : "Comfortable";
}

function getFallbackRecommendationRank(row: RetirementCityRow): number | undefined {
  return row.recommendation_rank ?? undefined;
}

export function mapRowToCity(row: RetirementCityRow): City {
  return {
    city: row.city,
    country: row.country,
    region: normalizeRegion(row.region),
    monthlyCost: row.monthly_cost_usd,
    lifestyle: normalizeLifestyle(row.lifestyle_label),
    description: row.description,
    tags: row.tags ?? [],
    expenseShares: row.expense_shares ?? undefined,
    language: row.language ?? undefined,
    popularNeighborhoods: row.popular_neighborhoods ?? undefined,
    visaNotes: row.visa_notes ?? undefined,
    healthcareNotes: row.healthcare_notes ?? undefined,
    bestFor: row.best_for ?? undefined,
    avoidIf: row.avoid_if ?? undefined,
    recommendationRank: getFallbackRecommendationRank(row),
  };
}

export async function fetchCitiesFromDatabase(params?: {
  region?: string | null;
  lifestyle?: string | null;
}) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { data: null, error: null };
  }

  let query = supabase
    .from("retirement_cities")
    .select(
      "city,country,region,monthly_cost_usd,lifestyle_label,description,tags,expense_shares,language,popular_neighborhoods,visa_notes,healthcare_notes,best_for,avoid_if,recommendation_rank"
    )
    .order("monthly_cost_usd", { ascending: true })
    .order("city", { ascending: true });

  const region = params?.region;
  if (region && region.toLowerCase() !== "all") {
    query = query.eq("region", region);
  }

  const lifestyle = params?.lifestyle;
  if (lifestyle && lifestyle.toLowerCase() !== "all") {
    query = query.eq("lifestyle_label", lifestyle);
  }

  const { data, error } = await query;
  if (error || !data) {
    return { data: null, error };
  }

  return { data: data.map((row) => mapRowToCity(row as RetirementCityRow)), error: null };
}
