## 1. Backend Fix

- [x] 1.1 [Backend] Add `AND session_date NOT IN (SELECT session_date FROM plan_modifications)` to the `upcomingSessions` query in `apps/garmin-training/server/src/routes/suggestions.ts`

## 2. Verification

- [ ] 2.1 [Backend] Accept a suggestion, trigger Sync Garmin — confirm the accepted suggestion does not reappear
- [ ] 2.2 [Backend] Confirm unaccepted upcoming sessions still appear as suggestions after sync
