## Why

After a user accepts a suggestion and re-syncs Garmin, the same suggestions reappear. The `upcomingSessions` query passed to Claude is not filtered by `plan_modifications`, so Claude re-suggests adjustments for sessions the user already accepted.

## What Changes

- Add `NOT IN (SELECT session_date FROM plan_modifications)` filter to the `upcomingSessions` query in the suggestions route so already-accepted sessions are never passed to Claude again

## Capabilities

### New Capabilities
- `suggestions-accepted-filter`: Upcoming sessions with an existing accepted modification are excluded from suggestion generation

### Modified Capabilities
- `suggestions-load-trigger`: The suggestions endpoint now excludes accepted upcoming sessions in addition to accepted deviated sessions

## Impact

- Backend only: `apps/garmin-training/server/src/routes/suggestions.ts`
- No frontend changes, no schema changes

## Stakeholders

- Edgar Hernandez (sole user)

## Non-goals

- Scoping suggestions to current week only (planned future change)
- Changing the accept/reject flow
