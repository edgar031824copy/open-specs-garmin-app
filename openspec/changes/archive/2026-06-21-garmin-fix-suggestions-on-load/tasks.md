## 1. Backend — Filter accepted sessions [Backend]

- [x] 1.1 In `apps/garmin-training/server/src/routes/suggestions.ts`, add `AND suggested_training IS NULL` to the `deviatedSessions` query so accepted sessions are never re-suggested

## 2. Frontend — Split load functions [Frontend]

- [x] 2.1 In `apps/garmin-training/client/src/App.tsx`, extract a `loadSessions` function that fetches only sessions (used on page load)
- [x] 2.2 Update `loadData` (or rename to `loadAll`) to fetch both sessions and suggestions — used post-sync and post-upload
- [x] 2.3 Wire `useEffect` on page load to call `loadSessions` instead of `loadAll`
- [x] 2.4 Update `onRefresh` prop passed to `PlanView` to call `loadAll` (sync should refresh suggestions)
- [x] 2.5 Keep `onUploaded` on `UploadForm` calling `loadAll` (fresh upload warrants suggestion refresh)
- [x] 2.6 Keep `onAccepted` on `SuggestionsPanel` calling `loadSessions` only (no re-generate after accept)

## 3. Verification [Frontend]

- [x] 3.1 Refresh page — confirm `/api/suggestions` is NOT called (check Network tab)
- [x] 3.2 Click Sync Garmin — confirm `/api/suggestions` IS called after sync
- [x] 3.3 Accept a suggestion — refresh page — confirm that session does not reappear in suggestions panel
