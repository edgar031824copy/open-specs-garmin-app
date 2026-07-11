## Context

`computeAlignment()` (`apps/garmin-training/server/src/lib/alignment.ts`) determines `alignment_status` from distance and pace only. The `GarminActivity` type (`src/lib/garmin.ts`) does not carry heart-rate zone data at all — the `garmin-connect` npm package only exposes an `hasHrTimeInZones: boolean` flag on activity summaries (`activity.d.ts:280`), not the actual per-zone time breakdown. Garmin Connect's web UI gets that breakdown from an endpoint (`/activity-service/activity/{activityId}/hrTimeInZones`) that the npm package doesn't wrap, but the underlying `GarminConnect` instance exposes a raw `this.client.get(url)` (seen used throughout `GarminConnect.js`, e.g. for `ACTIVITY`, `STAT_ACTIVITIES`), which we can call directly with this unwrapped path.

## Goals / Non-Goals

**Goals:**
- Fetch actual time-in-zone data for the day's activity and parse a target zone (e.g. "Z2") out of the plan text.
- Compute a `zoneDeviation` annotation (human-readable string + raw numbers) when actual zone-time diverges from the target zone.
- Surface it in the Training Plan session card as a soft note, and pass it into the AI suggestion prompt context.
- Never let zone deviation change `alignment_status`.

**Non-Goals:**
- No new alignment status value or hard pass/fail gate.
- No zone-range targets (e.g. "Z2–Z3") — only a single named zone per session in this change.
- No historical zone-trend analytics or notifications.

## Decisions

- **Fetch zone data via raw endpoint, not a new dependency.** The `garmin-connect` package has no typed wrapper for time-in-zones. Rather than forking/patching the package, add a small helper in `garmin.ts` that calls `client.get('/activity-service/activity/' + activityId + '/hrTimeInZones')` using the already-authenticated client instance. Alternative considered: fork the package — rejected, too heavy for a PoC and adds maintenance burden.
- **Target zone parsed as a separate, independent field from distance/pace.** Add `parseTargetZone(training: string): number | null` in `alignment.ts` matching patterns like "Z2", "Zone 2". Kept separate from `parseDistanceRange`/`parsePaceRange` since it's an orthogonal signal, not a stricter version of the same check.
- **Deviation threshold: flag when <50% of session time was spent in the target zone (or its adjacent zone).** Chosen to match the example in the screenshot (2% in Z2, 74% in Z3) — a clear miss — while tolerating normal drift. Exact threshold is tunable; not exposed as user-facing config in this change.
- **New function `computeZoneDeviation()`, not a modification of `computeAlignment()`.** Keeps the existing alignment contract (specs `distance-range-alignment`, `pace-deviation-format`) untouched and makes the annotation trivially optional if zone data is unavailable (fetch fails or returns empty → annotation is `null`, no error surfaced to the user).
- **Always attempt the zone-time fetch; don't gate on `hasHrTimeInZones`.** Discovered during testing that the activities-list search endpoint doesn't reliably populate `hasHrTimeInZones` (it came back `false`/absent for every activity even though the detail view had zone data). Gating on it silently skipped every session. The flag is still stored on `GarminActivity` for potential future use, but `computeZoneDeviation` no longer checks it — it always calls `getHrTimeInZones` and treats a `null`/empty result as "no data available."
- **Annotation shape:** `{ targetZone: number, actualZone: number | null, actualZonePercent: number, message: string } | null`, attached to the session response alongside `alignment_status` — not stored in Supabase (computed on read, same as current alignment).

## Risks / Trade-offs

- [Raw endpoint is undocumented/unofficial and could change] → Wrap the call in a try/catch; on failure, `zoneDeviation` is `null` and the rest of the response is unaffected (mirrors existing tolerance for the unofficial Garmin API).
- [Extra API call per session on every sync] → Only fetch zone data for days that have an activity and a parseable target zone in the plan text, not for every row.
- [Threshold is a guess, not user-validated] → Documented as tunable; revisit after Edgar tests real syncs.

## Open Questions

- Should the deviation threshold be configurable per plan/session in a future change once we see real usage patterns?
