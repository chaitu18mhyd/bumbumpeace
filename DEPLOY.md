# Deploying BumBumSafe (for QA)

The app is **all-in-one Next.js** and deploys as a **single Vercel project** — no
separate backend needed. City data lives in `data/cities.ts` and is:

- read directly (server-side) by the website, and
- exposed as a JSON API at **`/api/cities`** (a Next.js Route Handler) for
  external clients like a future mobile app.

You do **not** need a custom domain — Vercel gives you a free `*.vercel.app` URL.
You can attach a real domain later.

---

## Deploy → Vercel

1. Push this repo to GitHub (if it isn't already).
2. Go to https://vercel.com → **Add New → Project** → import this repo.
3. Vercel auto-detects **Next.js**. Settings:
   - **Root Directory:** `.` (repo root, where `package.json` is)
   - Build/Output: leave defaults.
   - **No environment variables required.**
4. **Deploy.** You'll get a URL like `https://bumbumpeace.vercel.app`.

That's it — the site and its `/api/cities` endpoint are both live on that one URL.

### Verify
- `https://<your-app>.vercel.app/` → the app, showing all cities.
- `https://<your-app>.vercel.app/api/cities` → JSON `{ count, cities }`.
  - Optional filters: `?region=Europe`, `?lifestyle=Premium`.

## Share with QA
Send QA the Vercel URL.

## Updating
Vercel redeploys automatically on every push to the connected branch.

## Custom domain later
Add it in Vercel project settings when you've decided on a name — no code changes.

---

## Note: the Go API (`bumbumpeace-api/`) is now optional / legacy

The website no longer depends on the Go service — the data was moved into the
Next.js app so everything runs on Vercel. The Go API (with its Dockerfile) is
kept in the repo only if you later want a standalone Go backend (e.g. to match
the monorepo for a mobile app). It is **not** part of the Vercel deploy.

To keep the two in sync, `data/cities.ts` can be regenerated from the Go API
JSON if you ever run it (`scripts`-style: fetch `/cities` and emit the TS array).
