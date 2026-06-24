## Context

`planFilename` and `planStartDate` are written to `localStorage` on upload and read by `PlanView` on render. Any browser without that localStorage state (other device, incognito, mobile) never sees the banner. Moving metadata to the DB and serving it via API makes it device-independent.

## Goals / Non-Goals

**Goals:**
- Plan metadata (filename + start date) is persisted in Supabase alongside sessions
- `GET /api/plan/metadata` returns current metadata or `null`
- `PlanView` receives metadata as props; no component reads localStorage for display
- Banner appears on any device where a plan is loaded in the DB

**Non-Goals:**
- No multi-user or multi-plan history support
- No removal of existing `localStorage` writes in `UploadForm` (harmless, left as-is)
- No backend authentication changes

## Decisions

**Single-row `plan_metadata` table — DELETE + INSERT on each upload**

Same pattern as `plan_sessions`. Keeps the model simple: there is always at most one active plan. No versioning or history needed for this PoC.

**Fetch metadata in `loadAll` (not a separate effect)**

`loadAll` is already called on mount (via `loadSessions` path) and after every upload. Adding `fetchPlanMetadata` there ensures metadata and sessions are always in sync with one round-trip batch.

Actually: `loadSessions` fires on mount (unconditional after the previous fix). `loadAll` fires after upload. To show metadata on initial load, `fetchPlanMetadata` must also fire on mount — either add it to `loadSessions` (rename to `loadAll`) or add a second `useEffect`. Cleanest: collapse `loadSessions` into `loadAll` since both are now needed on mount.

**Props over context**

`planFilename` and `planStartDate` flow from `App` → `PlanView` as props. No context needed for two fields shared with one child.

## Risks / Trade-offs

- **Migration must be run manually in Supabase SQL editor** → document the SQL in tasks.md; no automated migration runner exists
- **Render cold start** → same as before; loading state already handles it
