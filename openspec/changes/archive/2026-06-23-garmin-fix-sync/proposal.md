## Why

The Garmin sync endpoint has two bugs: it overwrites previously good alignment data with "missed" when the Garmin API returns no activities (e.g. from Render's IP), and it uses UTC date conversion that causes tomorrow's sessions to be treated as past sessions in UTC- timezones.

## What Changes

- Guard sync updates: skip overwrite if the Garmin API returned no activities and the session already has `aligned` or `not_aligned` status
- Fix today's date boundary: derive the cutoff date string from local date parts instead of `toISOString()` to avoid UTC offset shifting it to the next day

## Capabilities

### New Capabilities
<!-- none — both fixes are implementation corrections to existing behavior -->

### Modified Capabilities
- `garmin-sync`: requirement for sync idempotency (don't overwrite good data) and correct date boundary (sessions scheduled for tomorrow must not appear as missed today)

## Impact

- `apps/garmin-training/server/src/routes/sync.ts` — two targeted changes: date boundary fix (line 16) and overwrite guard (around line 45)
- No API contract changes, no schema changes, no frontend changes

## Stakeholders

- Edgar Hernandez (owner)
- Demo audience — incorrect "Missed" labels are visible in the UI and affect demo quality

## Non-goals

- Changing the sync frequency or making it automatic
- Fixing Garmin API rate-limiting or IP restrictions on Render
- Backfilling previously overwritten sessions
