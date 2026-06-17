# Deploying BumBumSafe (for QA)

Two services deploy from this one repo:

- **Frontend** (Next.js) → **Vercel** — root directory `.` (the `bumbumpeace` repo root)
- **API** (Go) → **Railway** — root directory `bumbumpeace-api`

You do **not** need a custom domain — both hosts give you a free URL
(`*.vercel.app`, `*.up.railway.app`). You can attach a real domain later.

Deploy the **API first**, grab its URL, then deploy the frontend pointing at it.

---

## 1. API → Railway

1. Push this repo to GitHub (if it isn't already).
2. Go to https://railway.app → **New Project → Deploy from GitHub repo** → pick this repo.
3. In the service **Settings**:
   - **Root Directory:** `bumbumpeace-api`
   - Railway will detect the `Dockerfile` and build with it.
   - (No env vars required. Optional: `ALLOWED_ORIGINS` — see note below.)
4. Under **Settings → Networking**, click **Generate Domain**. You'll get a URL like
   `https://bumbumpeace-api-production.up.railway.app`.
5. Verify it works:
   - `https://<your-api>.up.railway.app/health` → `{"status":"ok"}`
   - `https://<your-api>.up.railway.app/cities` → JSON with `count` and `cities`

Notes:
- The app listens on `$PORT` (Railway sets it automatically).
- The site calls the API **server-side**, so CORS is not required. Only set
  `ALLOWED_ORIGINS` (comma-separated) if you later add browser-side calls.

---

## 2. Frontend → Vercel

1. Go to https://vercel.com → **Add New → Project** → import this repo.
2. Vercel auto-detects **Next.js**. Settings:
   - **Root Directory:** `.` (repo root — where `package.json` is)
   - Build/Output: leave defaults.
3. Add an **Environment Variable**:
   - `API_URL` = your Railway API URL from step 1 (e.g.
     `https://bumbumpeace-api-production.up.railway.app`) — no trailing slash.
   - Apply to **Production** (and Preview if you want PR previews).
4. **Deploy.** You'll get a URL like `https://bumbumpeace.vercel.app`.

If the API is ever unreachable, the site automatically falls back to its bundled
mock city data (the original 12), so it still renders.

---

## 3. Share with QA

Send QA the **Vercel URL**. That's the full app (it pulls all cities from the
Railway API behind the scenes).

## Updating
Both hosts redeploy automatically on every push to the connected branch.

## Custom domain later
When you pick a name, add it in Vercel (frontend). If QA hits the API directly,
add the domain in Railway too and update `API_URL`.
