## Tasks

- [ ] In `apps/garmin-training/server/src/lib/garmin.ts` line 38, change `gc.getActivities(0, 20)` to `gc.getActivities(0, 200)`
- [ ] Re-upload CSV and sync — verify Jul 7 and Jul 8 sessions now show as aligned/not-aligned instead of missed
- [ ] Commit: `fix(garmin): increase activity fetch limit from 20 to 200`
