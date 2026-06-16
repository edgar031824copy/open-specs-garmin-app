## 1. Route Setup

- [ ] 1.1 Create `src/routes/health.ts` with a `GET /health` route handler stub
- [ ] 1.2 Register the `/health` route in the main app entry point

## 2. Filesystem Reader

- [ ] 2.1 Implement `listActiveChanges(changesDir)` — reads `openspec/changes/`, excludes `archive/`, returns folder names
- [ ] 2.2 Implement `getArtifactCount(changeDir, schema)` — counts done (file exists) vs total (schema-defined) artifacts, returns `{ done, total }`
- [ ] 2.3 Implement `getLastUpdated(changeDir)` — finds most recent mtime across all files in change folder, returns ISO 8601 string

## 3. Response Assembly

- [ ] 3.1 Implement `buildChangeStats(changeDir, name)` — calls artifact count + last updated helpers, returns single change stats object `{ name, status, artifactCount, lastUpdated }`
- [ ] 3.2 Wire route handler to call `listActiveChanges` then `buildChangeStats` for each, return array as JSON

## 4. Edge Cases

- [ ] 4.1 Handle empty `openspec/changes/` (only `archive/` present) — return `[]` with HTTP 200
- [ ] 4.2 Handle missing or unreadable change folder gracefully — skip that entry, do not crash

## 5. Verification

- [ ] 5.1 Test `GET /health` with two active changes — verify response shape matches spec
- [ ] 5.2 Test `GET /health` with no active changes — verify empty array response
- [ ] 5.3 Test artifact count for a partially complete change — verify `done` vs `total` is accurate
