## Why

After uploading a training plan, the UI displays sessions with no indication of which file was uploaded or what start date was used to generate the dates. Users cannot confirm they uploaded the right file or with the correct start date without re-uploading.

## What Changes

- Store `filename` and `start_date` in `localStorage` immediately after a successful plan upload
- Display filename and start date in `PlanView` above the session list
- Clear stored metadata when a new plan is uploaded

## Capabilities

### New Capabilities

- `plan-metadata-display`: After upload, persist and display the source filename and plan start date so users can verify what's currently loaded.

### Modified Capabilities

- `plan-upload`: Upload flow must write metadata to localStorage on success (existing spec — requirement change: success callback now has a side-effect contract).

## Impact

- `client/src/components/UploadForm.tsx`: write `planFilename` + `planStartDate` to localStorage on upload success
- `client/src/components/PlanView.tsx`: read and display localStorage metadata above the session table
- No backend changes, no database changes, no new env vars

## Stakeholders

- Garmin Training App users (single-user PoC, Edgar)
- LIT-37 reviewers validating end-to-end flow (AISDLC team)

## Non-goals

- Persisting metadata in Supabase (PoC scope; `plan_metadata` table is a post-PoC consideration)
- Multi-user metadata isolation
- Displaying metadata in sync or suggestions views
