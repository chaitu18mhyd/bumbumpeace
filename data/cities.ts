export type Region =
  | "North America"
  | "Europe"
  | "Latin America"
  | "Asia"
  | "Middle East"
  | "Oceania"
  | "Africa";

export type Lifestyle = "Lean" | "Comfortable" | "Premium";

export type City = {
  city: string;
  country: string;
  region: Region;
  monthlyCost: number;
  lifestyle: Lifestyle;
  description: string;
  tags: string[];
  /** Curated per-city split of monthly cost by category label (sums to 1.0). */
  expenseShares?: Record<string, number>;
};

export const COUNTRY_FLAGS: Record<string, string> = {
  Portugal: "🇵🇹",
  Spain: "🇪🇸",
  Colombia: "🇨🇴",
  Mexico: "🇲🇽",
  Thailand: "🇹🇭",
  Malaysia: "🇲🇾",
  Vietnam: "🇻🇳",
  Panama: "🇵🇦",
  Italy: "🇮🇹",
  India: "🇮🇳",
  Monaco: "🇲🇨",
  Switzerland: "🇨🇭",
  "United Kingdom": "🇬🇧",
  France: "🇫🇷",
  Austria: "🇦🇹",
  Netherlands: "🇳🇱",
  Denmark: "🇩🇰",
  Sweden: "🇸🇪",
  Germany: "🇩🇪",
  "United States": "🇺🇸",
  Canada: "🇨🇦",
  Uruguay: "🇺🇾",
  Argentina: "🇦🇷",
  Chile: "🇨🇱",
  Brazil: "🇧🇷",
  Singapore: "🇸🇬",
  "Hong Kong": "🇭🇰",
  Japan: "🇯🇵",
  "South Korea": "🇰🇷",
  China: "🇨🇳",
  Indonesia: "🇮🇩",
  "United Arab Emirates": "🇦🇪",
  Qatar: "🇶🇦",
  Israel: "🇮🇱",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  "South Africa": "🇿🇦",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
};

export function flagFor(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏳️";
}

export const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Latin America",
  "Asia",
  "Middle East",
  "Oceania",
  "Africa",
];

export const LIFESTYLES: Lifestyle[] = ["Lean", "Comfortable", "Premium"];

export const cities: City[] = [
  {
    city: "Lisbon",
    country: "Portugal",
    region: "Europe",
    monthlyCost: 3600,
    lifestyle: "Comfortable",
    description:
      "Coastal capital with strong healthcare, culture, and walkable neighborhoods.",
    tags: ["Healthcare", "Walkable", "Coastal", "Expat Friendly"],
  },
  {
    city: "Porto",
    country: "Portugal",
    region: "Europe",
    monthlyCost: 3000,
    lifestyle: "Comfortable",
    description:
      "Scenic riverside city with lower costs than Lisbon and excellent food.",
    tags: ["Walkable", "Culture", "Lower Cost", "Healthcare"],
  },
  {
    city: "Valencia",
    country: "Spain",
    region: "Europe",
    monthlyCost: 3200,
    lifestyle: "Comfortable",
    description:
      "Sunny Mediterranean city with beaches, transit, and great quality of life.",
    tags: ["Beach", "Great Weather", "Transit", "Healthcare"],
  },
  {
    city: "Medellín",
    country: "Colombia",
    region: "Latin America",
    monthlyCost: 2200,
    lifestyle: "Comfortable",
    description:
      "Mountain city with mild weather, modern amenities, and a growing expat scene.",
    tags: ["Low Cost", "Great Weather", "Expat Friendly", "Healthcare"],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    region: "North America",
    monthlyCost: 2800,
    lifestyle: "Comfortable",
    description:
      "Large cultural hub with world-class food, healthcare, and neighborhoods.",
    tags: ["Culture", "Healthcare", "Food", "Transit"],
  },
  {
    city: "Mérida",
    country: "Mexico",
    region: "North America",
    monthlyCost: 2100,
    lifestyle: "Lean",
    description:
      "Warm, relaxed city known for safety, affordability, and colonial charm.",
    tags: ["Low Cost", "Warm", "Safety", "Expat Friendly"],
  },
  {
    city: "Chiang Mai",
    country: "Thailand",
    region: "Asia",
    monthlyCost: 1800,
    lifestyle: "Lean",
    description:
      "Affordable northern Thai city popular with retirees and digital nomads.",
    tags: ["Low Cost", "Expat Friendly", "Food", "Great Weather"],
  },
  {
    city: "Penang",
    country: "Malaysia",
    region: "Asia",
    monthlyCost: 2300,
    lifestyle: "Comfortable",
    description:
      "Island city with strong healthcare, beaches, and excellent street food.",
    tags: ["Healthcare", "Beach", "Food", "Low Cost"],
  },
  {
    city: "Da Nang",
    country: "Vietnam",
    region: "Asia",
    monthlyCost: 1700,
    lifestyle: "Lean",
    description:
      "Beach city with low living costs, modern apartments, and relaxed pace.",
    tags: ["Beach", "Low Cost", "Great Weather", "Food"],
  },
  {
    city: "Panama City",
    country: "Panama",
    region: "Latin America",
    monthlyCost: 2900,
    lifestyle: "Comfortable",
    description:
      "Modern hub with skyline living, healthcare, and retiree visa appeal.",
    tags: ["Healthcare", "Expat Friendly", "Modern", "Transit"],
  },
  {
    city: "San Miguel de Allende",
    country: "Mexico",
    region: "North America",
    monthlyCost: 3100,
    lifestyle: "Premium",
    description:
      "Beautiful colonial city with art, restaurants, and a large expat community.",
    tags: ["Culture", "Expat Friendly", "Walkable", "Premium"],
  },
  {
    city: "Florence",
    country: "Italy",
    region: "Europe",
    monthlyCost: 4300,
    lifestyle: "Premium",
    description:
      "Historic city with world-class art, food, and access to European travel.",
    tags: ["Culture", "Walkable", "Food", "Premium"],
  },
];
