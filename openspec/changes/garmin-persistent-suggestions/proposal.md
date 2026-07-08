## Why

Suggestions are regenerated via the Anthropic API on every page load because `GET /api/suggestions` calls Claude directly and returns results without persisting them. This wastes API calls, produces non-deterministic responses across refreshes, and loses user decisions (reject is client-only and forgotten on reload). Suggestions and their accept/reject state need to be stored in the database.

## What Changes

- Add `suggestions` table to store Claude-generated suggestions with status (`pending` | `accepted` | `rejected`)
- `GET /api/suggestions` reads from DB instead of calling Claude
- New `POST /api/suggestions/generate` endpoint calls Claude, persists results (skipping `accepted`/`rejected` rows), and returns the new list
- `POST /api/suggestions/accept` updates `suggestions.status = accepted` in addition to writing to `plan_modifications`
- `POST /api/suggestions/reject` updates `suggestions.status = rejected` in DB (currently a no-op)
- Frontend: remove `fetchSuggestions` from initial `loadAll`; add "Get Suggestions" button to trigger generation; load cached suggestions on refresh

## Capabilities

### New Capabilities
- `suggestion-persistence`: Suggestions stored in DB with status; survive page refresh
- `suggestion-status`: Each suggestion tracks `pending | accepted | rejected`; regeneration skips decided rows

### Modified Capabilities
- `suggestion-accept`: Now also updates `suggestions.status = accepted` in the new table
- `suggestion-reject`: Now persists rejection to DB instead of being a client-side no-op

## Impact

- **DB:** New `suggestions` table; Supabase migration required (user must run SQL)
- **Backend:** `routes/suggestions.ts` — all four endpoints change
- **Frontend:** `App.tsx`, `SuggestionsPanel.tsx`, `api.ts`
- **APIs:** New `POST /api/suggestions/generate`; `GET /api/suggestions` shape unchanged
- **Stakeholders:** Garmin Training app only

## Stakeholders

- Edgar Hernandez (sole developer / PoC owner)

## Non-goals

- Bulk reject all
- Suggestion versioning / history across multiple generate calls
- Auto-generate suggestions after sync
