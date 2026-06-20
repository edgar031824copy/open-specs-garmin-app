## Parent Change

`openspec/changes/garmin-training-comparison` — this fix was spawned during apply of that change.

## Why

Sync marks flexible training sessions as missed when the user runs on an alternate day (e.g., runs Saturday instead of Friday). The `is_flexible` flag is stored correctly in the DB, but `sync.ts` performs exact primary-date matching only — alternate dates from the session's `Day` string are never checked.

## What Changes

- Sync resolves all valid dates for a session (primary + alternates parsed from the `Day` string) before matching against Garmin activities
- A Garmin activity on any valid date marks the session as completed

## Capabilities

### New Capabilities

_(none — this is a bug fix)_

### Modified Capabilities

- `garmin-sync`: date-matching requirement changes from exact primary-date match to primary + alternate date match for flexible sessions

## Stakeholders

- Edgar Hernandez (sole developer and user — single-user app)

## Non-goals

- No changes to how `is_flexible` or alternate dates are stored
- No retroactive fix for already-synced sessions
- No DB schema changes
- No multi-user support

## Impact

- `apps/garmin-training/server/src/routes/sync.ts` — matching logic
- `apps/garmin-training/server/src/lib/dateResolver.ts` — may need to expose alternate dates for a session
