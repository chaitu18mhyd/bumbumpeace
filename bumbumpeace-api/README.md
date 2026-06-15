# bumbumpeace-api

Phase 1 backend for the BumBumSafe website: a small Go HTTP service that owns the
city data (moving it off the client). No database and no auth yet — those are
later phases (Cognito + `go-jwt-middleware` for auth, a datastore for user
settings).

It currently lives inside the website repo (`bumbumpeace/bumbumpeace-api`) as its
own Go module, so it can be split into a standalone repo later with no code
changes.

## Run locally

```bash
cd bumbumpeace/bumbumpeace-api
go run .
# listens on http://localhost:8080
```

Environment variables (all optional):

| Var | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | Port to listen on |
| `ALLOWED_ORIGINS` | (none) | Extra CORS origins, comma-separated. `http://localhost:3000` is always allowed |

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `GET /cities` → `{ "count": N, "cities": [...] }`
  - Optional filters: `?region=Europe`, `?lifestyle=Comfortable` (use `all` or omit for no filter)

## Frontend integration

The Next.js app fetches `GET /cities` server-side. Set `API_URL` in the website
(defaults to `http://localhost:8080`). If the API is unreachable, the site falls
back to its bundled mock data so it still runs.

## Roadmap

- Phase 2: Cognito sign in/up; validate JWTs with `go-jwt-middleware`.
- Phase 3: `GET/PUT /me/settings` (per-user net worth + saved cities) backed by a datastore.
