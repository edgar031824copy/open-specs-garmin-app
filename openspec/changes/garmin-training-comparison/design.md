## Context

Single-user personal app for a runner who follows a structured training plan. The user uploads a CSV/XLS plan once, syncs with Garmin Connect to compare actual vs planned training, and uses AI-generated suggestions to adapt upcoming sessions. Backend on Render free tier, frontend on Netlify, persistence on Supabase free tier.

## Goals / Non-Goals

**Goals:**
- Parse and persist a training plan from a CSV/XLS file
- Fetch Garmin activities and compare against plan by distance and pace zone
- Generate AI suggestions for upcoming sessions using Claude
- Mobile-friendly React UI deployable at zero cost

**Non-Goals:**
- Multi-user support or authentication system
- Official Garmin OAuth (uses unofficial API via garmin-connect npm)
- Non-running activity types
- Automatic plan modification without user approval

## Decisions

**D1: Monorepo structure with separate frontend and backend apps**
`apps/garmin-training/` contains two subdirs: `client/` (React, deployed to Netlify) and `server/` (Express, deployed to Render). Shared `package.json` at root. Alternative was a single fullstack app on Render — rejected because Netlify CDN gives better mobile performance for the static frontend.

**D2: garmin-connect npm package over official Garmin Health API**
Official API requires partnership approval (weeks). `garmin-connect` works immediately with username/password stored as Render env vars. Acceptable for single-user PoC. Risk: unofficial API can break on Garmin Connect updates.

**D3: Date resolution from Week+Day columns using plan start date**
Rather than requiring the user to add a date column to every CSV row, the UI accepts a single plan start date and the backend computes calendar dates. Week=1/Day=Monday → start date; Week=1/Day=Wednesday → start date + 2 days, etc. Simpler CSV format, same result.

**D4: Alignment by distance (±10%) and pace (±10 sec/km)**
Binary thresholds keep comparison logic deterministic. Alternative was a scoring system (0–100%) — rejected as overly complex for v1. Pace comparison is skipped when no pace target is in the Training column.

**D5: AI suggestions via Anthropic SDK, not rule-based**
Claude receives: the full remaining plan, the deviation details (missed/distance/pace), and a prompt to suggest specific session adjustments. Rule-based logic can't handle the variety of training descriptions. Claude output is displayed as-is for user review before any modification is persisted.

**D6: Backend-only Supabase access via DATABASE_URL**
Frontend never talks to Supabase directly — all DB reads and writes go through the Express API. This eliminates the need for `SUPABASE_ANON_KEY` and keeps the architecture simple (one DB client, one connection string, same pattern as solo-mode projects). Two tables: `plan_sessions` and `plan_modifications`. Comparison and suggestion logic is stateless — computed on-demand, not cached.

## Risks / Trade-offs

- **Unofficial Garmin API breaks** → garmin-connect package stops working after a Garmin Connect update. Mitigation: pin the package version; monitor the package's GitHub issues.
- **Render free tier cold starts** → first request after inactivity takes ~30s. Mitigation: show a loading spinner; acceptable for personal use.
- **Pace parsing from natural language** → "Z2, 5:40–5:50/km" must be parsed from the Training string. Regex-based extraction; fails silently if format is unexpected (falls back to distance-only alignment). Mitigation: document expected formats in the UI.
- **Claude hallucinating bad suggestions** → AI might suggest volumes incompatible with the plan. Mitigation: user must explicitly accept each suggestion; nothing is auto-applied.

## Migration Plan

1. Create Supabase project, run table migrations (`plan_sessions`, `plan_modifications`)
2. Deploy Express backend to Render with env vars set
3. Deploy React frontend to Netlify with `VITE_API_URL` pointing to Render
4. Upload plan CSV, set start date, verify parsing
5. Trigger first Garmin sync, verify alignment results

No rollback needed — stateless backend, data only in Supabase (can be wiped and re-uploaded).

## Open Questions

- Does `garmin-connect` npm package support fetching activities by date range? (verify before implementing garmin-sync)
- What is the maximum file size Render free tier accepts for multipart uploads?
