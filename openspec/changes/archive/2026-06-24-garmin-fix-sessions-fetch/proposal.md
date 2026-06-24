## Why

The app only fetches training sessions when `localStorage.getItem('planFilename')` exists. Any browser without that key — incognito, mobile, new device — never fires the API call and shows "No sessions yet" even though the data lives in Supabase. The DB is the source of truth; the client should always reflect it.

## What Changes

- Remove the `localStorage` gate from the `useEffect` in `App.tsx` — sessions are fetched unconditionally on mount
- `planFilename` in `localStorage` remains in use only for the filename banner in `PlanView` (display concern, not a data gate)

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `plan-view`: Requirement change — the plan view must load and display sessions on any device, not only the one where the plan was originally uploaded

## Impact

- `apps/garmin-training/client/src/App.tsx` — single line change in `useEffect`
- No backend, DB, or API changes
- No breaking changes

## Stakeholders

- Edgar Hernandez (author/implementer)
