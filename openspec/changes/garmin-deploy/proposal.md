## Why

The Garmin Training Comparison app is code-complete and running locally, but only accessible on the developer's machine. Deploying to free-tier cloud services makes it accessible to collaborators, reviewers, and demo audiences without requiring a local setup.

## What Changes

- Deploy Express backend to Render free tier (web service)
- Deploy React/Vite frontend to Netlify free tier (static site)
- Expose backend environment variables (Supabase, Garmin credentials, Anthropic API key) via Render's environment settings
- Configure CORS on the backend to accept requests from the Netlify domain
- Wire frontend `VITE_API_URL` to point to the Render service URL
- Add `render.yaml` for infrastructure-as-code deployment config

## Capabilities

### New Capabilities
- `garmin-deployment`: Production deployment configuration for the Garmin Training app — Render backend + Netlify frontend, environment wiring, CORS policy, and deploy scripts

### Modified Capabilities
<!-- none — deployment is infrastructure only; no existing spec-level behavior changes -->

## Impact

- `apps/garmin-training/server/` — add `render.yaml`, confirm build/start scripts in `package.json`
- `apps/garmin-training/client/` — add `.env.production` with `VITE_API_URL`, confirm Netlify build command
- No schema or API contract changes; all behavioral specs remain unchanged
- Garmin unofficial API runs in a single-user context — credentials stay server-side in Render env vars

## Stakeholders

- Edgar Hernandez (owner, deployer)
- Mariana Santamaría (demo audience, LIT-37 reporter)
- Labs team (Lunch & Learn demo recipients)

## Non-goals

- Custom domain or TLS beyond Render/Netlify defaults
- CI/CD pipelines or automated deploys on push
- Multi-user authentication or access control
- Paid tier upgrades
- Database migration automation (Supabase migration already applied manually)
