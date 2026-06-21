## Why

On every page load, the frontend calls `/api/suggestions`, triggering Claude to regenerate suggestions even when prior suggestions have already been accepted. This produces duplicate or re-generated suggestions for sessions where `suggested_training` is already set, and makes an unnecessary (and costly) AI call on each refresh.

## What Changes

- **Frontend**: Remove `fetchSuggestions()` from the page-load data fetch (`loadData`). Suggestions are now only fetched after "Sync Garmin" is clicked.
- **Backend**: Add `AND suggested_training IS NULL` filter to the `deviatedSessions` query in `GET /api/suggestions` — skip sessions that already have an accepted suggestion.
- `onRefresh` prop passed to `PlanView` is updated to call both sessions and suggestions (post-sync is the right moment to regenerate).

## Capabilities

### New Capabilities

- `suggestions-load-trigger`: Defines when `/api/suggestions` is called — exclusively post-sync, not on page load.

### Modified Capabilities

- `suggestion-accept`: Accepted suggestions must be durable across page reloads — once accepted, that session must not re-appear as a candidate for suggestion generation.

## Stakeholders

- Edgar Hernandez (sole user of this app — no cross-team coordination required for this fix)

## Non-goals

- Adding an explicit "Refresh Suggestions" button (out of scope — sync is the intended trigger)
- Persisting rejected suggestions server-side

## Impact

- `apps/garmin-training/client/src/App.tsx`: split `loadData` into `loadSessions` (page load) and `loadAll` (post-sync)
- `apps/garmin-training/server/src/routes/suggestions.ts`: filter `suggested_training IS NULL` in deviatedSessions query
- `openspec/specs/suggestion-accept/spec.md`: delta spec to add durability requirement
