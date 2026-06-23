## 1. Date Boundary Fix (Backend)

- [x] 1.1 In `apps/garmin-training/server/src/routes/sync.ts`, replace the `today` calculation with local date parts: `const d = new Date(); const todayStr = \`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}\`` and use `todayStr` directly in the SQL query instead of `today.toISOString().split('T')[0]`

## 2. Overwrite Guard (Backend)

- [x] 2.1 In `apps/garmin-training/server/src/routes/sync.ts`, after fetching `activities`, add a guard: if `activities.length === 0` and `session.alignment_status` is `aligned` or `not_aligned`, push the existing status to results and `continue` to the next session without updating the DB

## 3. Verify (Backend)

- [ ] 3.1 Run the app locally, sync Garmin, and confirm sessions with existing `aligned`/`not_aligned` data are not overwritten when Garmin returns no activities for those dates
- [ ] 3.2 Confirm that tomorrow's session does not appear as "Missed" after syncing (date boundary fix)
