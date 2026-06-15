package main

// City is the canonical, server-owned shape for a retirement city.
// JSON keys intentionally match the frontend TypeScript `City` type.
type City struct {
	City        string   `json:"city"`
	Country     string   `json:"country"`
	Region      string   `json:"region"`
	MonthlyCost int      `json:"monthlyCost"`
	Lifestyle   string   `json:"lifestyle"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
}

// cities is the in-memory source of truth for Phase 1 (no DB yet).
var cities = []City{
	{
		City:        "Lisbon",
		Country:     "Portugal",
		Region:      "Europe",
		MonthlyCost: 3600,
		Lifestyle:   "Comfortable",
		Description: "Coastal capital with strong healthcare, culture, and walkable neighborhoods.",
		Tags:        []string{"Healthcare", "Walkable", "Coastal", "Expat Friendly"},
	},
	{
		City:        "Porto",
		Country:     "Portugal",
		Region:      "Europe",
		MonthlyCost: 3000,
		Lifestyle:   "Comfortable",
		Description: "Scenic riverside city with lower costs than Lisbon and excellent food.",
		Tags:        []string{"Walkable", "Culture", "Lower Cost", "Healthcare"},
	},
	{
		City:        "Valencia",
		Country:     "Spain",
		Region:      "Europe",
		MonthlyCost: 3200,
		Lifestyle:   "Comfortable",
		Description: "Sunny Mediterranean city with beaches, transit, and great quality of life.",
		Tags:        []string{"Beach", "Great Weather", "Transit", "Healthcare"},
	},
	{
		City:        "Medellín",
		Country:     "Colombia",
		Region:      "Latin America",
		MonthlyCost: 2200,
		Lifestyle:   "Comfortable",
		Description: "Mountain city with mild weather, modern amenities, and a growing expat scene.",
		Tags:        []string{"Low Cost", "Great Weather", "Expat Friendly", "Healthcare"},
	},
	{
		City:        "Mexico City",
		Country:     "Mexico",
		Region:      "North America",
		MonthlyCost: 2800,
		Lifestyle:   "Comfortable",
		Description: "Large cultural hub with world-class food, healthcare, and neighborhoods.",
		Tags:        []string{"Culture", "Healthcare", "Food", "Transit"},
	},
	{
		City:        "Mérida",
		Country:     "Mexico",
		Region:      "North America",
		MonthlyCost: 2100,
		Lifestyle:   "Lean",
		Description: "Warm, relaxed city known for safety, affordability, and colonial charm.",
		Tags:        []string{"Low Cost", "Warm", "Safety", "Expat Friendly"},
	},
	{
		City:        "Chiang Mai",
		Country:     "Thailand",
		Region:      "Asia",
		MonthlyCost: 1800,
		Lifestyle:   "Lean",
		Description: "Affordable northern Thai city popular with retirees and digital nomads.",
		Tags:        []string{"Low Cost", "Expat Friendly", "Food", "Great Weather"},
	},
	{
		City:        "Penang",
		Country:     "Malaysia",
		Region:      "Asia",
		MonthlyCost: 2300,
		Lifestyle:   "Comfortable",
		Description: "Island city with strong healthcare, beaches, and excellent street food.",
		Tags:        []string{"Healthcare", "Beach", "Food", "Low Cost"},
	},
	{
		City:        "Da Nang",
		Country:     "Vietnam",
		Region:      "Asia",
		MonthlyCost: 1700,
		Lifestyle:   "Lean",
		Description: "Beach city with low living costs, modern apartments, and relaxed pace.",
		Tags:        []string{"Beach", "Low Cost", "Great Weather", "Food"},
	},
	{
		City:        "Panama City",
		Country:     "Panama",
		Region:      "Latin America",
		MonthlyCost: 2900,
		Lifestyle:   "Comfortable",
		Description: "Modern hub with skyline living, healthcare, and retiree visa appeal.",
		Tags:        []string{"Healthcare", "Expat Friendly", "Modern", "Transit"},
	},
	{
		City:        "San Miguel de Allende",
		Country:     "Mexico",
		Region:      "North America",
		MonthlyCost: 3100,
		Lifestyle:   "Premium",
		Description: "Beautiful colonial city with art, restaurants, and a large expat community.",
		Tags:        []string{"Culture", "Expat Friendly", "Walkable", "Premium"},
	},
	{
		City:        "Florence",
		Country:     "Italy",
		Region:      "Europe",
		MonthlyCost: 4300,
		Lifestyle:   "Premium",
		Description: "Historic city with world-class art, food, and access to European travel.",
		Tags:        []string{"Culture", "Walkable", "Food", "Premium"},
	},
}
