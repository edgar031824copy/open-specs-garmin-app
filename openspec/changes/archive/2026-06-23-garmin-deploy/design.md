## Context

The Garmin Training app is code-complete with a working Express backend (port 3001) and Vite/React frontend (port 5173). Both run locally via `npm run dev`. The backend already reads `PORT` from env and has `build`/`start` scripts. CORS is currently open (`cors()` with no origin restriction).

Deployment target: Render free tier (backend) + Vercel free tier (frontend), zero cost, minimal config.

## Goals / Non-Goals

**Goals:**
- Backend accessible at a stable Render URL
- Frontend accessible at a stable Vercel URL
- Frontend talks to the deployed backend via `VITE_API_URL`
- CORS restricted to the Vercel origin in production
- Environment variables (Supabase, Garmin, Anthropic) stored in Render's dashboard

**Non-Goals:**
- CI/CD or auto-deploy on push
- Custom domains or custom TLS
- Multi-user auth
- Database migrations (already applied to Supabase)

## Decisions

### Render Web Service for backend
Render's free "Web Service" tier runs a persistent Node.js process — the right fit for Express. Static Site tier won't work (no server runtime). The service targets `apps/garmin-training/server/` as root; build runs `npm install && npm run build` (TypeScript compile), start runs `npm start` (`node dist/index.js`).

Add `render.yaml` at the monorepo root for IaC — avoids manual dashboard clicks and makes the config reviewable.

### Vercel for frontend
Vercel's free tier hosts static files with global CDN. Build command: `npm run build` inside `apps/garmin-training/client/`. Publish dir: `apps/garmin-training/client/dist`. Add `vercel.json` at `apps/garmin-training/client/` for SPA routing (all routes redirect to `index.html`).

`VITE_API_URL` is set as a Vercel env var pointing to the Render service URL — baked into the client bundle at build time by Vite.

### CORS restriction in production
Current `cors()` call is open to all origins. In production the backend should restrict to the Vercel domain. Use `ALLOWED_ORIGIN` env var on Render — if set, pass it as `origin` to the cors middleware; otherwise fall back to open (preserves local dev behavior without code changes).

### Environment variables
All secrets stay in Render's environment settings (not committed). Required vars:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — database
- `GARMIN_EMAIL`, `GARMIN_PASSWORD` — Garmin unofficial API
- `ANTHROPIC_API_KEY` — Claude suggestions
- `ALLOWED_ORIGIN` — Vercel frontend URL for CORS

## Risks / Trade-offs

**Render free tier cold starts** → After 15 min of inactivity the service spins down. First request after sleep takes ~30s. Mitigation: acceptable for PoC/demo use; warn users in the README.

**Garmin unofficial API on a shared IP** → Garmin may rate-limit or block requests from Render's shared IP range. Mitigation: single-user PoC; if blocked, test locally and note as a known limitation.

**`VITE_API_URL` baked at build time** → Changing the Render URL requires a Vercel rebuild. Mitigation: Render URLs are stable once created; not a practical issue for this PoC.
