## 1. Database

- [x] 1.1 [Platform] Run the following migration in the Supabase SQL editor:
  ```sql
  CREATE TABLE IF NOT EXISTS plan_metadata (
    id SERIAL PRIMARY KEY,
    plan_filename TEXT NOT NULL,
    plan_start_date DATE NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

## 2. Backend

- [x] 2.1 [Backend] In `POST /api/plan/upload` (`plan.ts`), after committing sessions: `DELETE FROM plan_metadata` then `INSERT INTO plan_metadata (plan_filename, plan_start_date) VALUES ($1, $2)` using `req.file.originalname` and `planStartDate`
- [x] 2.2 [Backend] Add `GET /api/plan/metadata` route: query `plan_metadata` for the single row; return `{ planFilename, planStartDate }` or `null` if empty

## 3. Frontend

- [x] 3.1 [Frontend] Add `PlanMetadata` interface and `fetchPlanMetadata()` to `api.ts`
- [x] 3.2 [Frontend] In `App.tsx`: add `planMetadata` state; collapse `loadSessions` into `loadAll` (fetch sessions + metadata together); call `loadAll` unconditionally on mount
- [x] 3.3 [Frontend] Pass `planFilename` and `planStartDate` as props to `PlanView`
- [x] 3.4 [Frontend] In `PlanView.tsx`: add `planFilename?` and `planStartDate?` to Props interface; remove `localStorage.getItem` calls; use props for the banner

## 4. Verification

- [x] 4.1 [Frontend] Open app in incognito — banner shows with filename and start date
- [x] 4.2 [Frontend] Upload a new plan — banner updates to reflect new file
- [x] 4.3 [Frontend] Clear DB (or use empty DB) — banner does not appear
