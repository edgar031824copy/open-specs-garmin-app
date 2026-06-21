## Context

The suggestions route builds two lists for Claude: `deviatedSessions` (past sessions that were not aligned or missed) and `upcomingSessions` (future sessions). The `deviatedSessions` query already filters out accepted sessions via `NOT IN (SELECT session_date FROM plan_modifications)`. The `upcomingSessions` query does not — so accepted suggestions for upcoming sessions are re-sent to Claude on every fetch, causing the same suggestions to reappear.

## Goals / Non-Goals

**Goals:**
- Apply the same `NOT IN (SELECT session_date FROM plan_modifications)` filter to `upcomingSessions`
- Accepted upcoming sessions no longer appear in suggestions after re-sync

**Non-Goals:**
- Scoping suggestions to current week only (separate future change)
- Changing how `deviatedSessions` is filtered (already correct)
- Any frontend changes

## Decisions

### Single-line SQL change

Add `AND session_date NOT IN (SELECT session_date FROM plan_modifications)` to the `upcomingSessions` query. The subquery pattern is already used for `deviatedSessions` — consistent, no new abstraction needed.

## Risks / Trade-offs

- **None significant.** The subquery is identical to the existing one on `deviatedSessions` and runs against the same small table. No performance concern at PoC scale.

## Migration Plan

1. Edit `upcomingSessions` query in `suggestions.ts` — one line addition
2. No DB migration, no rollback needed
