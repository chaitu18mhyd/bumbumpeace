# BumBumSafe — Retirement City Recommendation Prototype

A mobile-first, responsive single-page prototype that helps users explore cities
where they could retire based on expected monthly expenses.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.
City data is read from **Supabase Postgres**.

## Features

- Hero section with CTA
- Sticky, mobile-first filter panel: **investable assets** input + **annual
  withdrawal rate**, region, lifestyle, and a within-budget toggle
- A sustainable **monthly budget is derived from your investable assets**
  (retirement corpus — invested + cash, excluding your home) using the safe
  withdrawal rate (`assets × rate ÷ 12`; default 4%/yr → ~$4,000/mo from
  $1.2M), and drives the under/over-budget logic
- City cards with cost, lifestyle tier, description, tags, and an
  under/over-budget indicator
- Fully client-side filtering with a live summary: _"Showing X cities. Y are
  under your budget."_

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Supabase setup (database-backed city data)

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. Run `supabase/schema.sql` in Supabase SQL Editor.
4. Seed starter records:

```bash
npm run seed:supabase
```

The app (`app/page.tsx`) and API (`GET /api/cities`) will read from
`retirement_cities`.

Security notes:
- The table is created in `public`, but `anon` and `authenticated` are denied table access.
- Reads are done server-side with `SUPABASE_SERVICE_ROLE_KEY`.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Project structure

- `app/page.tsx` — page, filter state, and grid
- `app/layout.tsx` / `app/globals.css` — root layout and theme
- `components/CityCard.tsx` — single city tile
- `components/FilterPanel.tsx` — filter controls
- `data/cities.ts` — city types and UI metadata helpers
- `data/retirement-cities.seed.json` — Supabase seed input
- `lib/format.ts` — USD currency formatting
- `lib/retirementCities.ts` — Supabase fetch + mapping helpers
- `supabase/schema.sql` — DB schema and security policy
- `scripts/seed-retirement-cities.mjs` — seed script

> Prototype estimates only — not financial advice.
