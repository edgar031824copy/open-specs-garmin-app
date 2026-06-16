## Context

No central visibility into active change lifecycle state currently exists. Engineers check each change folder manually. This endpoint reads the filesystem at request time — no persistence layer needed since `openspec/changes/` is the source of truth.

## Goals / Non-Goals

**Goals:**
- Single endpoint that returns phase stats for all active changes in one response
- Derive all data from existing artifact files (no new data store)
- Stateless — safe to call at any time without side effects

**Non-Goals:**
- Authentication / authorization (out of scope for PoC)
- Historical data or change timelines
- Mutation (write operations on changes)

## Decisions

**Filesystem reads over a database**
Reading `openspec/changes/` directly avoids any sync problem between a store and the actual artifact files. The source of truth is already on disk. Downside: scales poorly past ~hundreds of changes, acceptable for PoC scope.

**Response shape per change:**
```json
{
  "name": "health-dashboard-endpoint",
  "status": "in-progress",
  "artifactCount": { "done": 2, "total": 4 },
  "lastUpdated": "2026-06-16T10:00:00Z"
}
```
`lastUpdated` derived from the most recent mtime across artifact files in the change folder.

## Risks / Trade-offs

- [Stale reads on rapid writes] → Acceptable at PoC scale; mtime resolution is sufficient
- [No auth] → Intentional non-goal; add as a follow-up if adopted by teams
