package main

// Major cities of Tennessee and Louisiana (United States, North America).
// US expense profiles skew slightly higher on healthcare and transport (car
// dependence). Each share map sums to 1.0.
func init() {
	usStd := map[string]float64{
		"Rent": 0.32, "Food": 0.18, "Travel": 0.13, "Healthcare": 0.13,
		"Utilities": 0.10, "Leisure": 0.09, "Other": 0.05,
	}
	usAffluent := map[string]float64{
		"Rent": 0.36, "Food": 0.17, "Travel": 0.12, "Healthcare": 0.12,
		"Utilities": 0.09, "Leisure": 0.09, "Other": 0.05,
	}
	usResort := map[string]float64{
		"Rent": 0.34, "Food": 0.18, "Travel": 0.12, "Healthcare": 0.11,
		"Utilities": 0.09, "Leisure": 0.11, "Other": 0.05,
	}

	type spec struct {
		city, desc, lifestyle string
		cost                  int
		tags                  []string
		shares                map[string]float64
	}

	specs := []spec{
		// Tennessee
		{"Nashville", "Music City — vibrant culture, food, and a healthcare hub.", "Comfortable", 2800, []string{"Culture", "Food", "Music", "Healthcare"}, usStd},
		{"Memphis", "Blues birthplace on the Mississippi with low costs and soul food.", "Lean", 2200, []string{"Low Cost", "Music", "Food", "Culture"}, usStd},
		{"Knoxville", "Riverside city by the Smokies with a relaxed pace.", "Lean", 2300, []string{"Low Cost", "Nature", "Walkable", "Healthcare"}, usStd},
		{"Chattanooga", "Scenic mountain-and-river city with a revitalized downtown.", "Lean", 2300, []string{"Nature", "Walkable", "Low Cost", "Great Weather"}, usStd},
		{"Franklin", "Charming, affluent historic town south of Nashville.", "Comfortable", 3200, []string{"Safety", "Walkable", "Culture", "Healthcare"}, usAffluent},
		{"Murfreesboro", "Fast-growing college town in the heart of Tennessee.", "Lean", 2400, []string{"Low Cost", "Safety", "Healthcare", "Walkable"}, usStd},
		{"Clarksville", "Affordable riverside city with a military-town energy.", "Lean", 2200, []string{"Low Cost", "Safety", "Nature", "Warm"}, usStd},
		{"Johnson City", "Appalachian city with mild seasons and outdoor access.", "Lean", 2100, []string{"Low Cost", "Nature", "Healthcare", "Safety"}, usStd},
		{"Gatlinburg", "Gateway resort town to the Great Smoky Mountains.", "Comfortable", 2600, []string{"Nature", "Great Weather", "Walkable", "Premium"}, usResort},
		{"Kingsport", "Quiet, very affordable city in the Tri-Cities region.", "Lean", 2000, []string{"Low Cost", "Nature", "Safety", "Healthcare"}, usStd},
		{"Brentwood", "Upscale, leafy suburb with top schools and safety.", "Comfortable", 3400, []string{"Safety", "Premium", "Walkable", "Healthcare"}, usAffluent},
		{"Jackson", "Affordable West Tennessee hub between Memphis and Nashville.", "Lean", 2000, []string{"Low Cost", "Food", "Safety", "Healthcare"}, usStd},

		// Louisiana
		{"New Orleans", "Soulful, festive city of jazz, Creole food, and history.", "Comfortable", 2600, []string{"Culture", "Food", "Music", "Walkable"}, usStd},
		{"Baton Rouge", "Louisiana's capital and college town on the Mississippi.", "Lean", 2300, []string{"Low Cost", "Food", "Culture", "Healthcare"}, usStd},
		{"Shreveport", "Affordable northwest hub with casinos and Cajun flavor.", "Lean", 2000, []string{"Low Cost", "Food", "Warm", "Culture"}, usStd},
		{"Lafayette", "Heart of Cajun country with great food and live music.", "Lean", 2200, []string{"Food", "Music", "Culture", "Low Cost"}, usStd},
		{"Lake Charles", "Lakeside southwest city with casinos and warm weather.", "Lean", 2100, []string{"Low Cost", "Warm", "Nature", "Food"}, usStd},
		{"Metairie", "Suburban New Orleans community with easy access to the city.", "Comfortable", 2400, []string{"Safety", "Food", "Healthcare", "Walkable"}, usStd},
		{"Bossier City", "Affordable riverfront city across from Shreveport.", "Lean", 2000, []string{"Low Cost", "Warm", "Food", "Safety"}, usStd},
		{"Alexandria", "Central Louisiana crossroads with very low living costs.", "Lean", 1900, []string{"Low Cost", "Warm", "Nature", "Safety"}, usStd},
		{"Monroe", "Affordable northeast city along the Ouachita River.", "Lean", 1900, []string{"Low Cost", "Nature", "Warm", "Food"}, usStd},
		{"Houma", "Bayou city steeped in Cajun culture and seafood.", "Lean", 2000, []string{"Food", "Culture", "Warm", "Low Cost"}, usStd},
		{"Slidell", "Relaxed lakeside community on the north shore.", "Lean", 2100, []string{"Low Cost", "Nature", "Warm", "Safety"}, usStd},
		{"Covington", "Charming, walkable north-shore town with a calm pace.", "Comfortable", 2400, []string{"Walkable", "Safety", "Culture", "Nature"}, usStd},
	}

	for _, s := range specs {
		cities = append(cities, City{
			City:          s.city,
			Country:       "United States",
			Region:        "North America",
			MonthlyCost:   s.cost,
			Lifestyle:     s.lifestyle,
			Description:   s.desc,
			Tags:          s.tags,
			ExpenseShares: s.shares,
		})
	}
}
