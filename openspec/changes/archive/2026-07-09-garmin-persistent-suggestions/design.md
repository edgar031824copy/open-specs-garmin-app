## Context

Currently `GET /api/suggestions` calls `generateSuggestions()` (Anthropic SDK) on every request and returns results without writing to DB. Accept writes to `plan_modifications`. Reject does nothing server-side. On the frontend, `loadAll()` fetches suggestions on mount — so every page load hits the Claude API.

The fix: introduce a `suggestions` table as the source of truth. Separate the read path (`GET`) from the generate path (`POST /generate`).

## Goals / Non-Goals

**Goals:**
- Zero Anthropic API calls on page load / refresh
- Rejected suggestions persist across sessions
- Regeneration preserves accepted/rejected decisions
- Minimal schema addition (one table, one migration)

**Non-Goals:**
- Auto-regenerating after sync (future)
- Multi-plan suggestion scoping

## Decisions

**New `suggestions` table (not columns on `plan_sessions`):**
Suggestions are a separate concern from the training plan row. A session can have one suggestion at a time; a dedicated table keeps it cleanly queryable by status.

```sql
CREATE TABLE suggestions (
  session_date   DATE PRIMARY KEY,
  original_training   TEXT NOT NULL,
  suggested_training  TEXT NOT NULL,
  reason         TEXT,
  status         TEXT NOT NULL DEFAULT 'pending',  -- pending | accepted | rejected
  generated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**`POST /api/suggestions/generate` is the Claude entry point:**
`GET /api/suggestions` becomes a pure DB read. This makes the contract explicit — GET never costs tokens. The frontend shows a "Get Suggestions" button that calls POST /generate.

**Regeneration skips accepted/rejected rows:**
When generate runs, it queries deviated/missed sessions excluding those already in `suggestions` with status `accepted` or `rejected`. New `pending` rows are upserted; decided rows are never overwritten.

**Accept flow:** `POST /accept` → upsert `plan_modifications` (existing) + `UPDATE suggestions SET status='accepted'`.

**Reject flow:** `POST /reject` → `UPDATE suggestions SET status='rejected'`. No longer a no-op.

## Risks / Trade-offs

- `[Low]` Existing accepted suggestions in `plan_modifications` have no matching row in `suggestions`. → On accept, upsert into `suggestions` as `accepted` so the tables stay consistent going forward. Old rows without a `suggestions` entry are unaffected.
- `[Low]` Migration must be run manually in Supabase SQL editor by Edgar. → One-time, one table, no data loss.
