package main

// Premium expense-share templates (each sums to 1.0). Luxury living skews
// toward higher rent; resort spots skew toward leisure.
var (
	luxFinance = map[string]float64{
		"Rent": 0.45, "Food": 0.17, "Travel": 0.11, "Healthcare": 0.10,
		"Utilities": 0.07, "Leisure": 0.07, "Other": 0.03,
	}
	luxResort = map[string]float64{
		"Rent": 0.40, "Food": 0.18, "Travel": 0.13, "Healthcare": 0.09,
		"Utilities": 0.07, "Leisure": 0.10, "Other": 0.03,
	}
	luxCulture = map[string]float64{
		"Rent": 0.42, "Food": 0.19, "Travel": 0.12, "Healthcare": 0.10,
		"Utilities": 0.07, "Leisure": 0.07, "Other": 0.03,
	}
)

type luxSpec struct {
	city, country, region, desc string
	cost                        int
	tags                        []string
	shares                      map[string]float64
}

// init appends 50 luxury cities (Premium lifestyle) to the canonical list.
func init() {
	specs := []luxSpec{
		// Europe
		{"Monaco", "Monaco", "Europe", "Glamorous Mediterranean micro-state synonymous with wealth and yachts.", 12000, []string{"Coastal", "Safety", "Walkable", "Premium"}, luxFinance},
		{"Zurich", "Switzerland", "Europe", "Pristine financial capital with lakeside living and top healthcare.", 9000, []string{"Safety", "Healthcare", "Walkable", "Transit"}, luxFinance},
		{"Geneva", "Switzerland", "Europe", "Refined lakeside city of diplomacy, watches, and clean living.", 8500, []string{"Safety", "Healthcare", "Walkable", "Coastal"}, luxFinance},
		{"London", "United Kingdom", "Europe", "World city blending finance, culture, and historic grandeur.", 8000, []string{"Culture", "Transit", "Food", "Walkable"}, luxFinance},
		{"Paris", "France", "Europe", "Iconic capital of art, cuisine, and elegant boulevards.", 7000, []string{"Culture", "Food", "Walkable", "Transit"}, luxCulture},
		{"Milan", "Italy", "Europe", "Italy's fashion and design capital with sleek modern style.", 6000, []string{"Culture", "Food", "Walkable", "Modern"}, luxCulture},
		{"Vienna", "Austria", "Europe", "Imperial city repeatedly ranked the world's most livable.", 5500, []string{"Culture", "Healthcare", "Walkable", "Safety"}, luxCulture},
		{"Amsterdam", "Netherlands", "Europe", "Canal-laced city with art, bikes, and a high quality of life.", 6500, []string{"Walkable", "Culture", "Transit", "Safety"}, luxFinance},
		{"Copenhagen", "Denmark", "Europe", "Design-forward Nordic capital known for hygge and happiness.", 6500, []string{"Walkable", "Safety", "Healthcare", "Modern"}, luxFinance},
		{"Stockholm", "Sweden", "Europe", "Elegant archipelago capital with clean design and nature.", 6000, []string{"Coastal", "Safety", "Healthcare", "Modern"}, luxFinance},
		{"Munich", "Germany", "Europe", "Prosperous Bavarian city with culture, parks, and the Alps nearby.", 6000, []string{"Safety", "Healthcare", "Culture", "Transit"}, luxFinance},
		{"Barcelona", "Spain", "Europe", "Mediterranean design capital with beaches and Gaudí architecture.", 5000, []string{"Beach", "Culture", "Food", "Walkable"}, luxCulture},
		{"Saint-Tropez", "France", "Europe", "Chic Riviera resort town famed for yachts and beach clubs.", 9000, []string{"Beach", "Coastal", "Great Weather", "Premium"}, luxResort},
		{"Lake Como", "Italy", "Europe", "Storied alpine lake lined with villas and celebrity retreats.", 7000, []string{"Coastal", "Great Weather", "Walkable", "Premium"}, luxResort},
		{"Marbella", "Spain", "Europe", "Sun-soaked Costa del Sol resort city with golf and marinas.", 5500, []string{"Beach", "Great Weather", "Coastal", "Expat Friendly"}, luxResort},

		// North America
		{"New York City", "United States", "North America", "The global capital of finance, culture, and ambition.", 9000, []string{"Culture", "Transit", "Food", "Modern"}, luxFinance},
		{"San Francisco", "United States", "North America", "Tech-driven bayside city with innovation and dramatic views.", 9000, []string{"Modern", "Food", "Transit", "Coastal"}, luxFinance},
		{"Los Angeles", "United States", "North America", "Sprawling sunbelt metropolis of beaches, film, and lifestyle.", 7500, []string{"Beach", "Great Weather", "Food", "Modern"}, luxResort},
		{"Miami", "United States", "North America", "Glittering coastal city with beaches, nightlife, and finance.", 7000, []string{"Beach", "Great Weather", "Coastal", "Expat Friendly"}, luxResort},
		{"Aspen", "United States", "North America", "Exclusive Rocky Mountain ski resort town for the elite.", 11000, []string{"Skiing", "Nature", "Premium", "Safety"}, luxResort},
		{"Honolulu", "United States", "North America", "Pacific island capital with year-round beaches and aloha.", 7500, []string{"Beach", "Great Weather", "Coastal", "Healthcare"}, luxResort},
		{"Vancouver", "Canada", "North America", "Coastal city framed by mountains with a high standard of living.", 6500, []string{"Coastal", "Healthcare", "Safety", "Nature"}, luxFinance},
		{"Toronto", "Canada", "North America", "Canada's cosmopolitan financial and cultural hub.", 6000, []string{"Culture", "Transit", "Food", "Safety"}, luxFinance},
		{"Boston", "United States", "North America", "Historic, walkable city with elite universities and hospitals.", 7000, []string{"Culture", "Healthcare", "Walkable", "Transit"}, luxCulture},
		{"Naples, Florida", "United States", "North America", "Upscale Gulf Coast retreat with beaches and golf.", 8000, []string{"Beach", "Great Weather", "Golf", "Expat Friendly"}, luxResort},

		// Latin America
		{"Punta del Este", "Uruguay", "Latin America", "South America's premier beach resort, the 'Monaco of the south'.", 4500, []string{"Beach", "Coastal", "Great Weather", "Safety"}, luxResort},
		{"Buenos Aires", "Argentina", "Latin America", "Elegant, European-flavored capital of tango and steak.", 4000, []string{"Culture", "Food", "Walkable", "Nightlife"}, luxCulture},
		{"Santiago", "Chile", "Latin America", "Modern Andean capital with wine country at its doorstep.", 4200, []string{"Modern", "Healthcare", "Nature", "Safety"}, luxFinance},
		{"Rio de Janeiro", "Brazil", "Latin America", "Spectacular beach city of Copacabana and Sugarloaf.", 4500, []string{"Beach", "Great Weather", "Coastal", "Culture"}, luxResort},
		{"São Paulo", "Brazil", "Latin America", "Latin America's powerhouse of business, dining, and art.", 4500, []string{"Culture", "Food", "Transit", "Modern"}, luxFinance},

		// Asia
		{"Singapore", "Singapore", "Asia", "Ultra-modern garden city-state with world-class everything.", 8000, []string{"Safety", "Modern", "Healthcare", "Food"}, luxFinance},
		{"Hong Kong", "Hong Kong", "Asia", "Dazzling harbor metropolis where finance meets the tropics.", 8000, []string{"Transit", "Food", "Modern", "Coastal"}, luxFinance},
		{"Tokyo", "Japan", "Asia", "Hyper-refined megacity of cuisine, design, and order.", 6500, []string{"Culture", "Food", "Transit", "Safety"}, luxCulture},
		{"Seoul", "South Korea", "Asia", "Sleek, fast-moving capital of K-culture and innovation.", 5500, []string{"Modern", "Food", "Transit", "Healthcare"}, luxFinance},
		{"Shanghai", "China", "Asia", "Futuristic skyline city blending East and West luxury.", 5500, []string{"Modern", "Food", "Transit", "Culture"}, luxFinance},
		{"Kyoto", "Japan", "Asia", "Serene former capital of temples, gardens, and tradition.", 5000, []string{"Culture", "Walkable", "Safety", "Food"}, luxCulture},
		{"Bali", "Indonesia", "Asia", "Lush island of luxury villas, beaches, and wellness retreats.", 4000, []string{"Beach", "Great Weather", "Expat Friendly", "Coastal"}, luxResort},
		{"Phuket", "Thailand", "Asia", "Thailand's premier resort island with five-star beaches.", 4000, []string{"Beach", "Great Weather", "Coastal", "Expat Friendly"}, luxResort},

		// Middle East
		{"Dubai", "United Arab Emirates", "Middle East", "Futuristic desert metropolis of skyscrapers and indulgence.", 7000, []string{"Modern", "Safety", "Beach", "Expat Friendly"}, luxFinance},
		{"Abu Dhabi", "United Arab Emirates", "Middle East", "Polished Gulf capital with culture, beaches, and wealth.", 6500, []string{"Modern", "Safety", "Coastal", "Healthcare"}, luxFinance},
		{"Doha", "Qatar", "Middle East", "Gleaming, fast-rising Gulf city of museums and marinas.", 6000, []string{"Modern", "Safety", "Coastal", "Expat Friendly"}, luxFinance},
		{"Tel Aviv", "Israel", "Middle East", "Vibrant Mediterranean tech-and-beach city that never sleeps.", 6000, []string{"Beach", "Food", "Nightlife", "Modern"}, luxCulture},

		// Oceania
		{"Sydney", "Australia", "Oceania", "Stunning harbor city with iconic beaches and an easy lifestyle.", 7000, []string{"Beach", "Coastal", "Great Weather", "Modern"}, luxResort},
		{"Melbourne", "Australia", "Oceania", "Cultured, café-loving city repeatedly rated highly livable.", 6000, []string{"Culture", "Food", "Walkable", "Transit"}, luxCulture},
		{"Auckland", "New Zealand", "Oceania", "Sailing capital surrounded by harbors, islands, and nature.", 5500, []string{"Coastal", "Nature", "Safety", "Great Weather"}, luxResort},
		{"Gold Coast", "Australia", "Oceania", "Sun-and-surf resort strip with golden beaches and hinterland.", 5500, []string{"Beach", "Great Weather", "Coastal", "Nature"}, luxResort},
		{"Queenstown", "New Zealand", "Oceania", "Alpine adventure resort beside a dramatic glacial lake.", 6000, []string{"Nature", "Skiing", "Safety", "Great Weather"}, luxResort},

		// Africa
		{"Cape Town", "South Africa", "Africa", "Breathtaking coastal city beneath Table Mountain.", 4500, []string{"Beach", "Coastal", "Nature", "Great Weather"}, luxResort},
		{"Cairo", "Egypt", "Africa", "Ancient megacity of pyramids, history, and Nile-side living.", 3500, []string{"Culture", "Food", "Warm", "Walkable"}, luxCulture},
		{"Marrakech", "Morocco", "Africa", "Exotic imperial city of riads, souks, and desert luxury.", 3800, []string{"Culture", "Warm", "Food", "Walkable"}, luxResort},
	}

	for _, s := range specs {
		cities = append(cities, City{
			City:          s.city,
			Country:       s.country,
			Region:        s.region,
			MonthlyCost:   s.cost,
			Lifestyle:     "Premium",
			Description:   s.desc,
			Tags:          s.tags,
			ExpenseShares: s.shares,
		})
	}
}
