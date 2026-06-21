## Context

Accept and Reject currently both call `onAction()` after completion, which triggers a full `loadData()` — re-fetching sessions and re-calling Claude for new suggestions. This causes non-deterministic behavior (different suggestion counts on every action). Reject also has no server-side effect at all.

## Goals / Non-Goals

**Goals:**
- Accept: update `plan_sessions.suggested_training` in the DB, remove the card from local state
- Reject: remove the card from local state only — no server call
- Eliminate the post-action full re-generate

**Non-Goals:**
- Persisting rejections across reloads
- A manual "Refresh suggestions" trigger (future change)
- Changing how suggestions are generated

## Decisions

**Local state for the suggestion list** — `SuggestionsPanel` receives `suggestions` as a prop today. To support remove-by-item, it needs its own internal list state initialized from the prop. On accept or reject, it filters out the acted-upon item by `sessionDate`. This avoids prop-drilling a remove callback and keeps the panel self-contained.

**Accept calls `onAction()` once after DB update** — sessions need to refresh so PlanView shows the updated `suggested_training`. But suggestions are NOT re-fetched — only `fetchSessions` is called. The `onAction` prop should be replaced with separate `onAccepted` (calls `fetchSessions` only) and no callback for reject.

**Backend: update `plan_sessions` in the accept handler** — the existing `POST /api/suggestions/accept` already writes to `plan_modifications`. Add an `UPDATE plan_sessions SET suggested_training = $1 WHERE session_date = $2` in the same handler so both writes are co-located.

**Remove `rejectSuggestion` API call** — the `/api/suggestions/reject` endpoint is vestigial. Client-side only; the endpoint can be left in place but the client stops calling it.

## Risks / Trade-offs

- **Local state diverges from server** → Acceptable for PoC. Suggestions panel is re-initialized from fresh data on next page load.
- **Accept partial failure** (plan_modifications saved but plan_sessions not updated) → Both writes are in the same route handler; if the second UPDATE fails the response is 500 and the card stays visible.

## Migration Plan

No migration required. The `plan_sessions` table already has a `suggested_training` column (used by PlanView). No schema changes needed.

## Open Questions

None — scope is fully determined.
