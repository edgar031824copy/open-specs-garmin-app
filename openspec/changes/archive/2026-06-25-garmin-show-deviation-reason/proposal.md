## Why

When a session shows "Not aligned", users have no way to know what specifically failed — distance, pace, or something else. The `deviation_reason` field is already in the API response but is never rendered in the UI.

## What Changes

- `PlanView.tsx` renders `deviation_reason` below the actual stats line for sessions with `alignment_status: not_aligned`
- No backend or API changes needed — the field is already returned

## Capabilities

### New Capabilities
- `deviation-reason-display`: UI display of the deviation reason text on not-aligned sessions

### Modified Capabilities
- none

## Impact

- `apps/garmin-training/client/src/components/PlanView.tsx` — additive render only

## Stakeholders

- Garmin Training app (solo feature, no cross-team contracts)

## Non-goals

- Changing the format of `deviation_reason` stored in the DB
- Localizing or prettifying the reason string (shown as-is from the API)
- Showing reasons for `missed` sessions
