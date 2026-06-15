Prompts I have used to create this website

what is the best way to create a new website and deploy, is there a reliable online website that I can use? or should I create one from scratch?

I definitely would need database and user accounts at some point if not from the starting point

would like this to be mobile first

is there an app or website that tracks net worth and where can you retire based on how much you have?



Create a mobile-first retirement city recommendation website prototype.

Use Next.js with the App Router, TypeScript, and Tailwind CSS. If the project is not already initialized, generate the necessary files for a basic Next.js app.

Goal:
Build a single-page responsive website that helps users explore cities where they could retire based on expected monthly expenses.

Page requirements:
- Mobile-first design
- Clean, modern, card/tile-based layout
- Should look good on iPhone-sized screens first, then scale nicely to tablet and desktop
- No backend required
- No deployment required
- Use mock data only
- The page must be viewable locally with `npm run dev`

Create the following experience:

1. Hero section
   - Title: “Find Cities Where Your Retirement Money Goes Further”
   - Subtitle: “Compare estimated monthly retirement expenses across popular cities and countries.”
   - A prominent CTA button: “Explore Cities”
   - Secondary text: “Prototype estimates only — not financial advice.”

2. Simple input/filter section
   Include:
   - Monthly retirement budget input, default: 4000
   - Region filter dropdown:
     - All
     - North America
     - Europe
     - Latin America
     - Asia
   - Lifestyle filter dropdown:
     - Lean
     - Comfortable
     - Premium
   - A checkbox/toggle: “Show only cities under my budget”

3. City tiles/cards
   Display at least 12 city cards using mock data.

Each city card should show:
   - City name
   - Country
   - Region
   - Estimated monthly retirement cost
   - Lifestyle tier
   - Short one-line description
   - Tags such as “Healthcare”, “Beach”, “Walkable”, “Low Cost”, “Great Weather”, “Expat Friendly”
   - A small visual indicator:
     - “Under budget” if estimated monthly cost is less than or equal to the user’s monthly budget
     - “Over budget” if it is above budget

Use this mock city data:

[
  {
    city: "Lisbon",
    country: "Portugal",
    region: "Europe",
    monthlyCost: 3600,
    lifestyle: "Comfortable",
    description: "Coastal capital with strong healthcare, culture, and walkable neighborhoods.",
    tags: ["Healthcare", "Walkable", "Coastal", "Expat Friendly"]
  },
  {
    city: "Porto",
    country: "Portugal",
    region: "Europe",
    monthlyCost: 3000,
    lifestyle: "Comfortable",
    description: "Scenic riverside city with lower costs than Lisbon and excellent food.",
    tags: ["Walkable", "Culture", "Lower Cost", "Healthcare"]
  },
  {
    city: "Valencia",
    country: "Spain",
    region: "Europe",
    monthlyCost: 3200,
    lifestyle: "Comfortable",
    description: "Sunny Mediterranean city with beaches, transit, and great quality of life.",
    tags: ["Beach", "Great Weather", "Transit", "Healthcare"]
  },
  {
    city: "Medellín",
    country: "Colombia",
    region: "Latin America",
    monthlyCost: 2200,
    lifestyle: "Comfortable",
    description: "Mountain city with mild weather, modern amenities, and a growing expat scene.",
    tags: ["Low Cost", "Great Weather", "Expat Friendly", "Healthcare"]
  },
  {
    city: "Mexico City",
    country: "Mexico",
    region: "North America",
    monthlyCost: 2800,
    lifestyle: "Comfortable",
    description: "Large cultural hub with world-class food, healthcare, and neighborhoods.",
    tags: ["Culture", "Healthcare", "Food", "Transit"]
  },
  {
    city: "Mérida",
    country: "Mexico",
    region: "North America",
    monthlyCost: 2100,
    lifestyle: "Lean",
    description: "Warm, relaxed city known for safety, affordability, and colonial charm.",
    tags: ["Low Cost", "Warm", "Safety", "Expat Friendly"]
  },
  {
    city: "Chiang Mai",
    country: "Thailand",
    region: "Asia",
    monthlyCost: 1800,
    lifestyle: "Lean",
    description: "Affordable northern Thai city popular with retirees and digital nomads.",
    tags: ["Low Cost", "Expat Friendly", "Food", "Great Weather"]
  },
  {
    city: "Penang",
    country: "Malaysia",
    region: "Asia",
    monthlyCost: 2300,
    lifestyle: "Comfortable",
    description: "Island city with strong healthcare, beaches, and excellent street food.",
    tags: ["Healthcare", "Beach", "Food", "Low Cost"]
  },
  {
    city: "Da Nang",
    country: "Vietnam",
    region: "Asia",
    monthlyCost: 1700,
    lifestyle: "Lean",
    description: "Beach city with low living costs, modern apartments, and relaxed pace.",
    tags: ["Beach", "Low Cost", "Great Weather", "Food"]
  },
  {
    city: "Panama City",
    country: "Panama",
    region: "Latin America",
    monthlyCost: 2900,
    lifestyle: "Comfortable",
    description: "Modern hub with skyline living, healthcare, and retiree visa appeal.",
    tags: ["Healthcare", "Expat Friendly", "Modern", "Transit"]
  },
  {
    city: "San Miguel de Allende",
    country: "Mexico",
    region: "North America",
    monthlyCost: 3100,
    lifestyle: "Premium",
    description: "Beautiful colonial city with art, restaurants, and a large expat community.",
    tags: ["Culture", "Expat Friendly", "Walkable", "Premium"]
  },
  {
    city: "Florence",
    country: "Italy",
    region: "Europe",
    monthlyCost: 4300,
    lifestyle: "Premium",
    description: "Historic city with world-class art, food, and access to European travel.",
    tags: ["Culture", "Walkable", "Food", "Premium"]
  }
]

4. Interactivity
   - Filtering should happen client-side.
   - Budget input should immediately update whether cards are under or over budget.
   - The “show only cities under my budget” toggle should hide over-budget cards.
   - Region and lifestyle filters should work together.
   - Show a small summary above the grid:
     “Showing X cities. Y are under your budget.”

5. Design direction
   - Use a warm, trustworthy, modern financial-planning feel.
   - Use rounded cards, soft shadows, and clear spacing.
   - Use a sticky or prominent filter panel on mobile.
   - Cards should be easy to scan.
   - Monthly cost should be visually prominent.
   - Use semantic HTML and accessible labels.
   - Use clean reusable React components.

6. Files/components to create
   - `app/page.tsx`
   - reusable components if helpful:
     - `components/CityCard.tsx`
     - `components/FilterPanel.tsx`
   - mock data can live in the page file or a separate file like `data/cities.ts`

7. Implementation details
   - Use `"use client"` where needed for state.
   - Format monthly costs as USD currency.
   - Make sure the design works without any external API.
   - Do not use chart libraries.
   - Do not require a database.
   - Do not use authentication.
   - Keep everything simple and runnable locally.

After generating the code, include instructions for how to run it locally:
   - `npm install`
   - `npm run dev`
   - open `http://localhost:3000`

Make sure the final result looks like a polished prototype, not a plain demo.


-----

instead of monthly amount, we should be able to take networth and calculate cities based on it


-----

can we add a navigation menu on top with links - Calculator, Blog, About us to the left, Sign In, Join to the right top

----

need slide animation in mobile while clicking the nav button, the close button appearance needs to animated as well

----

Sign in and join links should always be shown, for mobile, no need to show the name Retirewell or whatever - just show the logo, move the hamburger to the left, keep the sign in and join link on top right

----

the website is called BumBumSafe meaning your wallet is safe or your behind is safe in a funny manner of saying

----

the image needs to be a jeans pant pocket, might contain a wallet and should signify that this website is to help people retire with dignity

---
generate image that is industry standard, feel free to keep versions in the repo but only use the one that is of industry website standard

----
add a todo folder, and add a file called logo.txt and explain what you think is left, not needed to do right now.

The website has a lot of text up top, we need to get to the point quickly, can we ask the main net worth question quicker on top? and move unnecessary stuff to the bottom of the page. We can be blunt about it - Enter your current/expected net worth to know where you can retire or something more beautified version of it

Right now there are too many options to choose, networth annual withdrawal rate, region, etc, we just need 1 data point as main, that is net worth, everything else should be under Filters with assumptions selected and modifiable.

add country flags to UI cards

suggest me a way to add rules to this repo that AI should follow everytime a prompt is made. For ex: one rule to follow is that this website needs to be apple and android friendly at all times

yes, it needs to be accessible, add a rule

The data is available in the console for everyone to see, is golang suggested for the server side to store some of the settings and also use it for sign ins and logins?

bumbumpeace-api should co-exist within bumbumpeace for now, in a later time I can push it separately if needed