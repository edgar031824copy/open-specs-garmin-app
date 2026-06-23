# open-specs

LIT-37 PoC — Spec-Driven Workflow Service using OpenSpec.

Demonstrates the OpenSpec lifecycle across two features:
- **Feature 1** ✅ Default path: Health dashboard endpoint — `propose → apply → sync → archive`
- **Feature 2** ✅ Expanded path: Garmin training comparison app — `new → ff → apply → verify → archive`

Both features are complete and archived. Pending: demo to Labs team (AC#4) + article (AC#5).

## Live app

- **Frontend:** https://garmin-training-l7c9qkrtj-edgar-hernandezs-projects-7046d4ad.vercel.app
- **Backend:** https://garmin-training-server-hm5v.onrender.com (free tier — cold starts ~50s)

## Structure

```
openspec/           # OpenSpec planning home
  changes/archive/  # All changes archived (10 total)
  specs/            # Canonical specs synced from changes
  config.yaml       # Team target + apply rules
apps/
  health-dashboard/ # Feature 1 implementation
  garmin-training/  # Feature 2 implementation
    server/         # Express + Supabase + Garmin + Anthropic (:3001)
    client/         # React + Vite (:5173)
render.yaml         # Render deployment config
```

## Running locally

```bash
npm install
npm run dev         # starts server on :3001 and client on :5173
```

Backend env vars: `apps/garmin-training/server/.env` (not committed — see `.env.example`).

## OpenSpec lifecycle

Managed via Claude Code slash commands (`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`).
See `openspec/changes/archive/` for all completed changes and `openspec/specs/` for canonical specs.
