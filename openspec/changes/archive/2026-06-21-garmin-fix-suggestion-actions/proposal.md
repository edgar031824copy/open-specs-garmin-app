## Why

Accept and Reject buttons on suggestions behave incorrectly: both re-ask Claude for a fresh set of suggestions after every action, making the list non-deterministic. Reject does nothing server-side yet still triggers a re-generate, causing suggestions to appear, disappear, or multiply unpredictably.

## What Changes

- **Accept**: save modification to `plan_modifications`, apply `suggested_training` back to the matching `plan_sessions` row, remove only that card from the UI — no full re-generate
- **Reject**: dismiss the card from the UI client-side only — no API call, no re-generate
- Suggestions are only regenerated when the user explicitly requests it (future scope), not after every action

## Capabilities

### New Capabilities

- `suggestion-accept`: Accepting a suggestion persists it and updates the session row so the plan view reflects the change immediately.
- `suggestion-reject`: Rejecting a suggestion dismisses it from the current list without any server round-trip.

### Modified Capabilities

- `plan-upload`: no spec-level change

## Impact

- `server/src/routes/suggestions.ts`: `POST /accept` must also update `plan_sessions.suggested_training` for the matching `session_date`
- `client/src/components/SuggestionsPanel.tsx`: accept removes the accepted card; reject removes the rejected card — neither triggers a full `onAction()` reload
- `client/src/App.tsx`: `onAction` prop on `SuggestionsPanel` can be removed or replaced with a per-item remove callback
- `client/src/api.ts`: `rejectSuggestion` signature changes (no longer needs a server call)

## Stakeholders

- Garmin Training App users (single-user PoC, Edgar)
- LIT-37 reviewers validating suggestion flow (AISDLC team)

## Non-goals

- Persisting rejection state across page reloads
- A "Refresh suggestions" button (future change)
- Bulk accept/reject
