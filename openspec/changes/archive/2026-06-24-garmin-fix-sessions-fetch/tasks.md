## 1. Frontend Fix

- [ ] 1.1 [Frontend] Remove `localStorage.getItem('planFilename')` guard from `useEffect` in `App.tsx` — call `loadSessions()` unconditionally on mount
- [ ] 1.2 [Frontend] Verify `planFilename` localStorage usage in `PlanView` is unaffected (filename banner still reads from localStorage independently)

## 2. Verification

- [ ] 2.1 [Frontend] Open the app in an incognito window and confirm the plan loads without uploading
- [ ] 2.2 [Frontend] Confirm the filename banner still displays correctly in the normal (non-incognito) session
- [ ] 2.3 [Frontend] Confirm "No sessions yet" still shows correctly when the DB is empty
