## Why

When a user uploads a new plan, the UI still displays the previous plan's filename banner and "✓ Synced N sessions" message. The upload succeeds (full DELETE + re-insert on the backend), but the frontend carries over stale state from the previous session, misleading the user about which plan is active.

## What Changes

- Clear sync state (sync result message, synced session count) on new plan upload
- Clear localStorage plan metadata (filename, start date) on new plan upload, before the new upload response is processed
- Ensure the filename banner and sync status reflect only the currently uploaded plan

## Capabilities

### New Capabilities
- `plan-state-reset`: Clears plan metadata and sync status in frontend state and localStorage when a new file is uploaded

### Modified Capabilities
- `plan-upload`: Upload flow now resets stale plan state before processing the new upload response

## Impact

- `apps/garmin-training/client/src/components/UploadForm.tsx` — trigger state reset on upload
- `apps/garmin-training/client/src/App.tsx` — expose reset handler or clear relevant state/localStorage keys
- No backend changes needed

## Stakeholders

- Garmin Training app (solo user, Edgar)

## Non-goals

- Full multi-plan support or plan history
- Resetting sync state on page refresh (only on explicit new upload)
