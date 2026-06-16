# BumBumSafe — Retirement City Recommendation Prototype

A mobile-first, responsive single-page prototype that helps users explore cities
where they could retire based on expected monthly expenses.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. No
backend, no database, no auth — mock data only.

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

## Project structure

- `app/page.tsx` — page, filter state, and grid
- `app/layout.tsx` / `app/globals.css` — root layout and theme
- `components/CityCard.tsx` — single city tile
- `components/FilterPanel.tsx` — filter controls
- `data/cities.ts` — mock city data and types
- `lib/format.ts` — USD currency formatting

> Prototype estimates only — not financial advice.
