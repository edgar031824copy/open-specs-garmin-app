## Context

`sync.ts` calls `getActivitiesForDate(session.session_date)` — a single date lookup per session. `dateResolver.ts` already parses flexible days (e.g., `"Fri/Sat"`) and stores `is_flexible = true`, but the alternate date (Saturday) is never exposed outside the resolver. Sync has no way to check alternates, so Saturday runs are permanently missed.

Two runtime constraints discovered during implementation:
- `session_date` from pg is a JavaScript `Date` object, not a string — must call `.toISOString().slice(0, 10)` before passing to `getActivitiesForDate`
- `DAY_OFFSETS` only had full day names (`friday`, `saturday`); the parsed CSV uses abbreviated names (`fri`, `sat`) — abbreviated forms had to be added

## Goals / Non-Goals

**Goals:**
- Sync checks primary date + all alternate dates for flexible sessions
- A match on any valid date marks the session completed

**Non-Goals:**
- No DB schema changes
- No retroactive fix for already-synced sessions
- No changes to how `is_flexible` is stored

## Decisions

**Decision 1: Add `getAlternateDateStrings()` helper to `dateResolver.ts`**

Rather than exposing `alternateDates: Date[]` via `resolveDates` (which requires `planStartDate`), a new exported function `getAlternateDateStrings(primaryDateStr, weekDay)` derives alternate dates from the already-stored `session_date` + `week_day` DB columns. This avoids re-running the full date resolution and requires no new DB columns.

Rationale: sync only has access to DB rows, not the original `planStartDate`. The helper computes the offset difference between primary and alternate day names and applies it to the known primary date.

Alternative considered: persist `alternateDates` during upload — rejected, requires a DB schema change and migration.

**Decision 2: Add abbreviated day names to `DAY_OFFSETS`**

Added `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun` alongside the existing full names. Parsed CSV/XLS files may use either form.

**Decision 3: Fetch activities for each alternate date separately**

Call `getActivitiesForDate(date)` once per candidate date (primary first, then alternates) and stop at the first match.

Rationale: the Garmin API wrapper is date-keyed. Batching is not supported. Short-circuit on first match avoids unnecessary API calls.

**Decision 4: No change to DB schema or alignment logic**

`session_date` stays as the primary date. `computeAlignment` receives whichever activity matched — the alignment logic is date-agnostic. No new columns needed.

## Risks / Trade-offs

- [Extra Garmin API calls] Flexible sessions may make 2 calls instead of 1 → Mitigation: short-circuit on first match; only one extra call per flexible session at most.
- [pg Date object] Any future code passing `session_date` directly to string-keyed functions will silently fail → always slice to `YYYY-MM-DD` at the call site.

## Migration Plan

1. Update `dateResolver.ts`: add abbreviated day names to `DAY_OFFSETS`; add `alternateDates: Date[]` to `ResolvedSession`; export `getAlternateDateStrings()` helper
2. Update `sync.ts`: slice `session_date` to plain date string; call `getAlternateDateStrings` for flexible sessions; short-circuit on first match
3. Manual re-sync: user triggers POST /api/sync to update any sessions previously marked missed
