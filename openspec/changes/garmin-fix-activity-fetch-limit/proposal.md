## Why

`getActivitiesForDate` fetches only the last 20 Garmin activities and filters by date client-side. As the training plan accumulates sessions, older dates fall outside the 20-activity window and are marked "Missed" even when the user ran. This is happening now in week 4+ of the plan.

## What Changes

- Increase the activity fetch limit so all sessions since plan start are covered
- Keep the client-side date filter (no behavioral change, just correct results)

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `garmin-sync`: The sync no longer incorrectly marks past sessions as missed when more than 20 activities exist since the plan start date.

## Impact

- `apps/garmin-training/server/src/lib/garmin.ts` — increase fetch limit in `getActivitiesForDate`
- No API contract changes, no DB schema changes
- No frontend changes

## Non-goals

- Pagination or cursor-based fetching (overkill for a single-user plan)
- Filtering by activity type at the API level

## Stakeholders

- Edgar (sole user and developer) — unblocked by this fix
