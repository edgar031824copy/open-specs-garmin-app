## 1. Database migration

- [x] 1.1 Create `suggestions` table in Supabase: `session_date DATE PRIMARY KEY, original_training TEXT, suggested_training TEXT, reason TEXT, status TEXT DEFAULT 'pending', generated_at TIMESTAMPTZ DEFAULT now()` (Platform — run in Supabase SQL editor)

## 2. Backend

- [x] 2.1 Rewrite `GET /api/suggestions` to read `pending` rows from `suggestions` table — no Claude call (Backend)
- [x] 2.2 Add `POST /api/suggestions/generate`: query deviated/missed sessions excluding `accepted`/`rejected` suggestions, call Claude, upsert `pending` rows, return full list (Backend)
- [x] 2.3 Update `POST /api/suggestions/accept` to also `UPDATE suggestions SET status='accepted'` for the given `session_date` (Backend)
- [x] 2.4 Implement `POST /api/suggestions/reject`: `UPDATE suggestions SET status='rejected'` for the given `session_date` (Backend)

## 3. Frontend

- [x] 3.1 Remove `fetchSuggestions()` from `loadAll()` in `App.tsx`; add separate `loadSuggestions()` that calls `GET /api/suggestions` (Frontend)
- [x] 3.2 Add `generateSuggestions()` API call (`POST /api/suggestions/generate`) in `api.ts` (Frontend)
- [x] 3.3 Add "Get Suggestions" button to `SuggestionsPanel.tsx`; wire to `POST /api/suggestions/generate` (Frontend)
- [x] 3.4 Wire `handleReject` in `SuggestionsPanel.tsx` to call `POST /api/suggestions/reject` before removing from list (Frontend)
