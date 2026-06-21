## Context

On every page load, `App.tsx` calls `loadData()` which fires both `fetchSessions()` and `fetchSuggestions()` in parallel. The backend `GET /api/suggestions` queries all `not_aligned`/`missed` sessions and sends them to Claude for generation — with no check for whether a session already has an accepted suggestion. Result: suggestions re-appear for sessions the user already acted on, and Claude is called on every browser refresh.

## Goals / Non-Goals

**Goals:**
- Suggestions are fetched only when meaningful new data exists (post-sync, post-upload)
- Sessions with an accepted `suggested_training` are never re-suggested
- Page load is cheaper (no Claude call)

**Non-Goals:**
- Adding a standalone "Refresh Suggestions" button
- Server-side persistence of rejected suggestions
- Changing when sync itself is triggered

## Decisions

**Decision 1: Split `loadData` into `loadSessions` and `loadAll` on the frontend**
- `loadSessions` — fetches sessions only; used on page load and after accepting a suggestion
- `loadAll` — fetches sessions + suggestions; used after sync and after upload
- Alternative considered: add a `fetchSuggestions` flag param to `loadData`. Rejected — two named functions are clearer at the call sites and avoid boolean-flag confusion.

**Decision 2: Filter `suggested_training IS NULL` in the backend query**
- The `deviatedSessions` query in `suggestions.ts` gains `AND suggested_training IS NULL`
- This is the authoritative guard — the frontend trigger change alone would not protect against direct API calls or future regressions
- Alternative considered: filter on `plan_modifications` table join. Rejected — `suggested_training` on `plan_sessions` is already the source of truth set by the accept route; filtering there is simpler and consistent.

## Risks / Trade-offs

- **Risk**: After sync, a previously accepted session may now be even more deviated, but won't get a new suggestion. → Accepted: `suggested_training` reflects a deliberate user decision; re-suggesting would override their intent. User can upload plan again to reset.
- **Trade-off**: Upload now triggers suggestions. This is correct behavior (new plan = new context) but slightly increases upload cost.

## Migration Plan

No schema or data migration needed. Changes are:
1. Edit `App.tsx` — split `loadData`, wire call sites
2. Edit `suggestions.ts` — add `AND suggested_training IS NULL` to query

Both changes are backward-compatible and safe to deploy without downtime.

## Open Questions

None — scope is fully determined.
