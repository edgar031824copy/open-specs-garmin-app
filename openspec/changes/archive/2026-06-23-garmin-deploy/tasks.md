## 1. Backend — CORS & Config (Platform)

- [x] 1.1 Update `apps/garmin-training/server/src/index.ts` to read `ALLOWED_ORIGIN` env var and pass it as `origin` to the `cors()` call; fall back to open if not set
- [x] 1.2 Add `render.yaml` at the repo root declaring a Web Service for `apps/garmin-training/server` with build command `npm install && npm run build` and start command `npm start`
- [x] 1.3 Add `.env.example` at `apps/garmin-training/server/` listing all required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`, `ALLOWED_ORIGIN`

## 2. Frontend — Build Config (Frontend)

- [x] 2.1 Update `apps/garmin-training/client/src/api.ts` to prefix all API calls with `import.meta.env.VITE_API_URL` (fall back to empty string for local dev)
- [x] 2.2 Add `apps/garmin-training/client/.env.production.example` with `VITE_API_URL=<render-url>`
- [x] 2.3 Add `apps/garmin-training/client/vercel.json` with a catch-all rewrite for SPA routing

## 3. Render Deploy (Platform)

- [x] 3.1 Create a new Web Service on Render pointing to this repo, root directory `apps/garmin-training/server`, using the `render.yaml` config
- [x] 3.2 Set all required env vars in the Render dashboard (`GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`, `DATABASE_URL`) — `PORT` is set automatically by Render
- [x] 3.3 Trigger a deploy and confirm `GET https://garmin-training-server-hm5v.onrender.com/health` returns `{"status":"ok"}`
- [x] 3.4 Set `ALLOWED_ORIGIN=https://garmin-training-entuqin0k-edgar-hernandezs-projects-7046d4ad.vercel.app` in Render env vars

## 4. Vercel Deploy (Frontend)

- [x] 4.1 Create a new Vercel project pointing to this repo, root directory `apps/garmin-training/client`, framework Vite
- [x] 4.2 Set `VITE_API_URL=https://garmin-training-server-hm5v.onrender.com` in Vercel env vars
- [x] 4.3 Deployed and confirmed app loads at https://garmin-training-entuqin0k-edgar-hernandezs-projects-7046d4ad.vercel.app

## 5. End-to-End Smoke Test (Platform)

- [x] 5.1 Upload a CSV plan from the Vercel URL — confirmed 7 sessions imported
- [x] 5.2 Triggered Garmin sync — confirmed 3 sessions processed
- [x] 5.3 Suggestions endpoint working — Claude returning suggestions
- [x] 5.4 ALLOWED_ORIGIN set with full https:// prefix — CORS resolved

## Known Issue

Sync overwrites aligned/not_aligned sessions with "missed" when Garmin API returns empty from Render's IP. Tracked as `garmin-fix-sync-overwrite`.
