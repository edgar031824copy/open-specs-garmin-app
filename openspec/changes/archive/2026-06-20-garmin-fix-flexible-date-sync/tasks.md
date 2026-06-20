## 1. Update dateResolver.ts

- [x] 1.1 [Backend] Add `alternateDates: Date[]` field to `ResolvedSession` interface
- [x] 1.2 [Backend] In `parseDayOffset`, return all day names from the `/`-split `Day` string (not just the primary)
- [x] 1.3 [Backend] In `resolveDates`, compute a `Date` for each alternate day name and populate `alternateDates` (empty array for non-flexible sessions)

## 2. Update sync.ts

- [x] 2.1 [Backend] After fetching activities for `session.session_date`, if result is empty and `session.is_flexible` is true, fetch activities for each date in `alternateDates` (stop at first match)
- [x] 2.2 [Backend] Pass the matched activity (from primary or alternate date) to `computeAlignment` — no change to alignment logic needed

## 3. Verify

- [x] 3.1 [Backend] Manually trigger POST /api/sync with a flexible session whose alternate date has a Garmin activity — confirm it is marked completed, not missed
- [x] 3.2 [Backend] Confirm non-flexible sessions are unaffected
