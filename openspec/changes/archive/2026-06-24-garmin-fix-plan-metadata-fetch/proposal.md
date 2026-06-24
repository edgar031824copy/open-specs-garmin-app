## Why

The plan filename and start date are stored only in `localStorage`, so the metadata banner ("📄 running - Hoja 4 (1).csv · starts Jun 15, 2026") never appears on devices that didn't perform the upload (mobile, incognito, new browser). Since the DB is the source of truth for plan data, plan metadata should live there too.

## What Changes

- Add a `plan_metadata` table to Supabase (single-row, replaced on each upload)
- On plan upload, persist `plan_filename` and `plan_start_date` to the new table alongside sessions
- Add `GET /api/plan/metadata` endpoint returning `{ planFilename, planStartDate }` or `null`
- Fetch metadata on app load; store in React state and pass as props to `PlanView`
- `PlanView` reads metadata from props instead of `localStorage`
- `localStorage` writes in `UploadForm` remain (harmless local cache) but are no longer the source of truth for the banner

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `plan-metadata-display`: Requirement change — metadata banner SHALL be visible on any device, not only the one where the plan was uploaded

## Impact

- `apps/garmin-training/server/src/routes/plan.ts` — persist metadata on upload, new GET route
- `apps/garmin-training/client/src/api.ts` — add `fetchPlanMetadata`
- `apps/garmin-training/client/src/App.tsx` — fetch + store metadata state, pass to `PlanView`
- `apps/garmin-training/client/src/components/PlanView.tsx` — accept props instead of reading localStorage
- Supabase: manual migration required (`plan_metadata` table)

## Stakeholders

- Edgar Hernandez (author/implementer)
