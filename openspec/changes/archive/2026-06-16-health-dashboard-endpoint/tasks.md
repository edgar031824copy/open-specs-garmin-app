## 0. Project Setup

- [x] 0.1 Create `package.json` with TypeScript, ts-node, jest, ts-jest, and `@types/node` dependencies
- [x] 0.2 Create `tsconfig.json` targeting ES2020 with `commonjs` modules and `src/` as root
- [x] 0.3 Run `npm install` to install dependencies

## 1. Route Setup

- [x] 1.1 Create `apps/health-dashboard/routes/health.ts` with a `GET /health` route handler stub
- [x] 1.2 Register the `/health` route in `apps/health-dashboard/index.ts`

## 2. Filesystem Reader

- [x] 2.1 Implement `listActiveChanges(changesDir)` — reads `openspec/changes/`, excludes `archive/`, returns folder names
- [x] 2.2 Implement `getArtifactCount(changeDir, schema)` — counts done (file exists) vs total (schema-defined) artifacts, returns `{ done, total }`
- [x] 2.3 Implement `getLastUpdated(changeDir)` — finds most recent mtime across all files in change folder, returns ISO 8601 string

## 3. Response Assembly

- [x] 3.1 Implement `buildChangeStats(changeDir, name)` — calls artifact count + last updated helpers, returns single change stats object `{ name, status, artifactCount, lastUpdated }`
- [x] 3.2 Wire route handler to call `listActiveChanges` then `buildChangeStats` for each, return array as JSON

## 4. Edge Cases

- [x] 4.1 Handle empty `openspec/changes/` (only `archive/` present) — return `[]` with HTTP 200
- [x] 4.2 Handle missing or unreadable change folder gracefully — skip that entry, do not crash

## 5. Verification

- [x] 5.1 Test `GET /health` with two active changes — verify response shape matches spec
- [x] 5.2 Test `GET /health` with no active changes — verify empty array response
- [x] 5.3 Test artifact count for a partially complete change — verify `done` vs `total` is accurate
