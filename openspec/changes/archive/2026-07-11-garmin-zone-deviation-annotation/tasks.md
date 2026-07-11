## 1. Garmin zone data fetch (Backend)

- [x] 1.1 Add `getHrTimeInZones(activityId): Promise<{ zoneNumber: number; secsInZone: number }[] | null>` to `server/src/lib/garmin.ts`, calling the authenticated client's raw `client.get()` against the unwrapped `hrTimeInZones` endpoint; return `null` on any error (unofficial endpoint, must not crash sync).
- [x] 1.2 Add `hasHrTimeInZones: boolean` to the `GarminActivity` interface and populate it from the activity summary in `getActivitiesForDate`.

## 2. Zone deviation computation (Backend)

- [x] 2.1 Add `parseTargetZone(training: string): number | null` to `server/src/lib/alignment.ts` matching "Z2"/"Zone 2"-style patterns.
- [x] 2.2 Add `computeZoneDeviation(training: string, activity: GarminActivity | null): Promise<ZoneDeviation | null>` — returns `null` if no target zone parsed, no activity, or `hasHrTimeInZones` is false; otherwise fetches zone data via 1.1, computes `actualZonePercent` for the target zone plus the dominant actual zone, and returns `{ targetZone, actualZonePercent, message }` only when actual time in target zone is below 50%.
- [x] 2.3 Wire `computeZoneDeviation` into the sync flow in `server/src/routes/sync.ts` alongside the existing `computeAlignment` call, attaching `zoneDeviation` to each session response.

## 3. Suggestion prompt integration (Backend)

- [x] 3.1 In `server/src/lib/claude.ts`, include each session's `zoneDeviation.message` (when present) in the prompt context passed to the Anthropic API for generating upcoming-session suggestions.

## 4. UI annotation (Frontend)

- [x] 4.1 In `client/src/components/PlanView.tsx`, render `zoneDeviation.message` as a soft note on the session card (visually distinct from the `Aligned`/`Not aligned` badge, e.g. muted text below the existing deviation reason line) when present.

## 5. Verification

- [x] 5.1 Manually sync a plan with a "Z2" session against real Garmin data and confirm the annotation appears with correct percentages, without changing `alignment_status`.
- [x] 5.2 Confirm sessions with no zone data (`hasHrTimeInZones: false`) or no target zone in the plan text show no annotation and no errors.
