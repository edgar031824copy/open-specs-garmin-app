## Approach

`getActivitiesForDate` in `garmin.ts` calls `gc.getActivities(0, 20)` — hardcoded limit of 20. Since a typical marathon plan has 3 sessions/week over 16+ weeks (~48+ sessions), plus non-running HIIT activities, the window fills up quickly.

Change the limit to 200. This covers 16 weeks × 3 sessions + up to ~100 HIIT/cross-training activities with a safe margin. The garmin-connect library's `getActivities` accepts `(start, limit)` — no pagination needed for a single-user plan of this scale.

## File Changed

- `apps/garmin-training/server/src/lib/garmin.ts` — line 38: `gc.getActivities(0, 20)` → `gc.getActivities(0, 200)`

## Why Not Pagination

The plan is single-user and bounded (~16 weeks). Fetching 200 activities in one call is well within Garmin's unofficial API tolerance and keeps the sync logic simple. Pagination would add complexity with no real benefit here.

## Non-goals

- Filtering by activity type at the API level (garmin-connect doesn't expose it)
- Dynamic limit based on plan length
