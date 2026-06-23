## Context

`sync.ts` has two bugs discovered after production deployment:

1. **Overwrite bug** — the sync unconditionally `UPDATE`s every past session. When the Garmin API returns no activities (e.g. Render's IP gets rate-limited, or a session is too far in the past), it sets `alignment_status = 'missed'`, stomping previously correct `aligned`/`not_aligned` data.

2. **Date boundary bug** — `today` is constructed with `setHours(23,59,59,999)` then serialized with `.toISOString()`. In UTC- timezones, midnight-local is past midnight-UTC, so `.toISOString().split('T')[0]` returns tomorrow's date. Sessions scheduled for tomorrow appear as past sessions and get processed (and marked "missed").

## Goals / Non-Goals

**Goals:**
- Sync never overwrites confirmed alignment data (`aligned`/`not_aligned`) with `missed`
- The date cutoff for "past sessions" always matches the user's local calendar date

**Non-Goals:**
- Fixing Garmin API rate-limiting or IP restrictions on Render
- Backfilling sessions already overwritten
- Changing sync frequency or making it automatic

## Decisions

### Overwrite guard: skip update when no activities and already synced
If `activities.length === 0` AND `session.alignment_status` is already `aligned` or `not_aligned`, skip the DB update and carry forward the existing status. This makes sync idempotent for confirmed sessions — re-running it doesn't degrade data quality.

Alternative considered: only overwrite if the session date is within the last N days. Rejected — too arbitrary, and the guard approach is simpler and more correct.

### Date boundary: derive cutoff from local date parts
Replace:
```ts
today.toISOString().split('T')[0]  // UTC — shifts to next day in UTC- timezones
```
With:
```ts
const d = new Date();
const todayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
```
`getFullYear/getMonth/getDate` return local time values, not UTC. No timezone shift.

Alternative considered: `toLocaleDateString('en-CA')` returns `YYYY-MM-DD` in local time. Rejected — locale-dependent behavior is a hidden dependency; explicit string construction is clearer.

## Risks / Trade-offs

**Guard prevents re-sync after a real missed session is corrected** → Acceptable: if a session was truly missed, the user won't run that day and the status stays `missed`. The guard only protects sessions that were already confirmed as aligned/not_aligned.

**Local date depends on server timezone** → On Render (UTC), local = UTC, so the fix has no effect there. The bug only manifests on local dev in UTC- timezones. Fixing it is still correct — consistent behavior regardless of where the server runs.
