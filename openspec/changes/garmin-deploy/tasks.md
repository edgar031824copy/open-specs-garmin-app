## 1. Backend — CORS & Config (Platform)

- [x] 1.1 Update `apps/garmin-training/server/src/index.ts` to read `ALLOWED_ORIGIN` env var and pass it as `origin` to the `cors()` call; fall back to open if not set
- [x] 1.2 Add `render.yaml` at the repo root declaring a Web Service for `apps/garmin-training/server` with build command `npm install && npm run build` and start command `npm start`
- [x] 1.3 Add `.env.example` at `apps/garmin-training/server/` listing all required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`, `ALLOWED_ORIGIN`

## 2. Frontend — Build Config (Frontend)

- [x] 2.1 Update `apps/garmin-training/client/src/api.ts` to prefix all API calls with `import.meta.env.VITE_API_URL` (fall back to empty string for local dev)
- [x] 2.2 Add `apps/garmin-training/client/.env.production.example` with `VITE_API_URL=<render-url>`
- [x] 2.3 Add `apps/garmin-training/client/netlify.toml` with a catch-all redirect (`/* → /index.html 200`) for SPA routing

## 3. Render Deploy (Platform)

- [ ] 3.1 Create a new Web Service on Render pointing to this repo, root directory `apps/garmin-training/server`, using the `render.yaml` config
- [ ] 3.2 Set all required env vars in the Render dashboard (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`) — `PORT` is set automatically by Render
- [ ] 3.3 Trigger a deploy and confirm `GET <render-url>/health` returns `{"status":"ok"}`
- [ ] 3.4 Set `ALLOWED_ORIGIN` in Render env vars to the Netlify URL (placeholder until Netlify is deployed — update after task 4.2)

## 4. Netlify Deploy (Frontend)

- [ ] 4.1 Create a new Netlify site pointing to this repo, base directory `apps/garmin-training/client`, build command `npm run build`, publish directory `dist`
- [ ] 4.2 Set `VITE_API_URL` in Netlify env vars to the Render service URL from task 3.3
- [ ] 4.3 Trigger a deploy and confirm the app loads at the Netlify URL

## 5. End-to-End Smoke Test (Platform)

- [ ] 5.1 Upload a CSV plan from the Netlify URL and confirm plan rows appear in the UI
- [ ] 5.2 Trigger a Garmin sync and confirm activities are fetched
- [ ] 5.3 Fetch suggestions and confirm Claude returns at least one suggestion
- [ ] 5.4 Update `ALLOWED_ORIGIN` on Render to the confirmed Netlify URL if it changed; redeploy backend if needed
