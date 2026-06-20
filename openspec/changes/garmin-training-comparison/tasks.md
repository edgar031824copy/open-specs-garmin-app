## 0. Project Setup [Platform]

- [x] 0.1 Create `apps/garmin-training/server/` directory with `package.json`, `tsconfig.json`, and Express entry point `src/index.ts` [Platform]
- [x] 0.2 Create `apps/garmin-training/client/` directory with Vite + React + TypeScript scaffold (`npm create vite`) [Frontend]
- [x] 0.3 Install backend dependencies: `garmin-connect`, `@anthropic-ai/sdk`, `pg`, `multer`, `papaparse`, `xlsx`, `express`, `cors`, `dotenv` [Platform]
- [x] 0.4 Install frontend dependencies: `axios` [Frontend]
- [x] 0.5 Create Supabase project and run migrations for `plan_sessions` and `plan_modifications` tables [Platform]
- [x] 0.6 Add `.env.example` with all required env vars: `GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`, `DATABASE_URL` [Platform]

## 1. Plan Upload — Backend [Backend]

- [x] 1.1 Implement `POST /api/plan/upload` endpoint with multer for multipart file upload; accept CSV and XLS/XLSX only, return 400 for other formats [Backend]
- [x] 1.2 Implement CSV parser using papaparse — extract Week, Day, Training columns; return 400 if any column is missing [Backend]
- [x] 1.3 Implement XLS/XLSX parser using xlsx package — same column extraction as CSV [Backend]
- [x] 1.4 Implement date resolver: given plan start date + Week + Day string, compute exact calendar date; handle "Friday/Saturday" as Friday + flexible flag [Backend]
- [x] 1.5 On upload, delete all existing `plan_sessions` rows and `plan_modifications` rows, then insert new sessions into Supabase [Backend]

## 2. Garmin Sync — Backend [Backend]

- [x] 2.1 Verify `garmin-connect` npm package can fetch activities by date range — test against real Garmin account in isolation before wiring up [Backend]
- [x] 2.2 Implement Garmin auth using `GARMIN_EMAIL` / `GARMIN_PASSWORD` env vars; return 503 with clear error on auth failure [Backend]
- [x] 2.3 Implement `POST /api/sync` endpoint — fetch all plan sessions with dates ≤ today, retrieve matching Garmin running activities [Backend]
- [x] 2.4 Implement alignment logic: compare actual vs planned distance (±10% tolerance) and pace (±10 sec/km where pace target exists); set `alignment_status` to aligned / not_aligned / missed [Backend]
- [x] 2.5 Persist alignment results back to `plan_sessions` in Supabase (update `alignment_status`, `actual_distance`, `actual_pace` columns) [Backend]

## 3. Training Suggestions — Backend [Backend]

- [x] 3.1 After sync, identify sessions with `alignment_status` = not_aligned or missed [Backend]
- [x] 3.2 Implement Anthropic API call: pass remaining plan sessions + deviation details to Claude claude-sonnet-4-6; prompt it to suggest specific adjustments to upcoming sessions [Backend]
- [x] 3.3 Expose suggestions as `GET /api/suggestions` — return array of `{ session_date, original_training, suggested_training, reason }` [Backend]
- [x] 3.4 Handle Anthropic API errors gracefully — return empty suggestions array, do not crash [Backend]

## 4. Suggestion Accept/Reject — Backend [Backend]

- [x] 4.1 Implement `POST /api/suggestions/accept` — store accepted modification in `plan_modifications` table with session date and new training description [Backend]
- [x] 4.2 Implement `POST /api/suggestions/reject` — no-op persistence, return 200 (client discards suggestion) [Backend]

## 5. Plan View — Frontend [Frontend]

- [x] 5.1 Implement plan upload form: file input (CSV/XLS), plan start date picker, submit button; call `POST /api/plan/upload` [Frontend]
- [x] 5.2 Implement plan list view: fetch all sessions from Supabase client-side; display date, training description, alignment badge (aligned/not_aligned/missed/upcoming) [Frontend]
- [x] 5.3 Show actual distance + pace for synced past sessions alongside planned values [Frontend]
- [x] 5.4 Mark sessions with accepted modifications visually (e.g., badge or strikethrough on original + new text) [Frontend]
- [x] 5.5 Add Sync button that calls `POST /api/sync` with loading state, then refreshes plan list [Frontend]
- [x] 5.6 Add Suggestions panel: fetch `GET /api/suggestions`, render each with Accept/Reject buttons; on accept call `POST /api/suggestions/accept` and refresh plan [Frontend]
- [x] 5.7 Ensure layout is mobile-responsive (320px–430px); tap targets ≥ 44px [Frontend]

## 6. Deployment [Platform]

- [ ] 6.1 Verify end-to-end locally: upload plan → sync → view alignment → accept suggestion [Platform]
- [ ] 6.2 Deploy Express backend to Render free tier; set all env vars in Render dashboard [Platform]
- [ ] 6.3 Deploy React frontend to Netlify; set `VITE_API_URL` to Render backend URL [Platform]
- [ ] 6.4 Smoke test on mobile after deployment: upload plan → sync → view alignment → accept suggestion [Platform]

---

## Known Issues Fixed During Apply

- **garmin-connect version hallucinated** (task 0.3): `package.json` referenced `^1.7.1` which does not exist on npm. Latest is `1.6.2`. Fixed inline — pinned to `^1.6.2`.
- **Date parsing bug** (task 2.1): `garmin.ts` used `startTimeLocal.split('T')[0]` but the library returns space-separated format (`"2026-06-17 06:39:19"`). The `??` fallback never triggered because split on a missing separator returns the whole string, not null. Fixed to `split(' ')[0]`.
- **TypeScript implicit any** (task 2.3): `let activities` in `sync.ts` had no type annotation, causing TS7034/TS7005 errors. Fixed by importing `GarminActivity` and typing the variable explicitly.
- **Duplicate DATABASE_URL key in .env** (task 6.1): `.env` had `DATABASE_URL=DATABASE_URL="postgresql://..."` — the key was repeated, causing `pg` to receive the literal string `DATABASE_URL="..."` as the connection string, which resolved the host as `"base"` (ENOTFOUND base). Fixed by removing the duplicate prefix.
- **Invalid Date in PlanView** (task 6.1): `formatDate` in `PlanView.tsx` appended `T00:00:00` to the raw `session_date` field, but Supabase returns dates as full ISO timestamps (e.g. `"2026-06-16T00:00:00+00:00"`), producing an unparseable string. Fixed by slicing to `d.slice(0, 10)` before appending the time suffix.
- **Timezone off-by-one in plan upload** (task 6.1): `new Date(planStartDate)` in `plan.ts` parsed the ISO date string as UTC midnight, which in local timezones behind UTC resolves to the previous calendar day, shifting all stored session dates back by 1 day. Fixed by parsing as `new Date(planStartDate + 'T12:00:00')` (local noon) to stay on the correct date regardless of timezone.
- **Timezone off-by-one in Garmin sync** (task 6.1): `getActivitiesForDate` in `garmin.ts` accepted a `Date` object and called `.toISOString().split('T')[0]`, converting back to UTC and shifting the lookup date by 1 day. Fixed by accepting a date string directly and passing `session.session_date` from `sync.ts` without any `Date` object conversion.
