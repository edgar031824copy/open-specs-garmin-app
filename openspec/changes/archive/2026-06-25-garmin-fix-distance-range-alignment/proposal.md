## Why

Sessions with a planned distance range (e.g. "5–6 km") are incorrectly marked as not aligned when the actual distance falls within the range. The parser extracts only the first digit before "km", grabbing the upper bound and ignoring the lower bound entirely.

## What Changes

- `parsePlannedDistance` is replaced by a `parseDistanceRange` function that returns `{min, max}` for range patterns like "5–6 km" and `{min: n, max: n}` for single-distance patterns
- The distance check in `computeAlignment` uses the range: if actual falls within `[min, max]`, no distance deviation is reported

## Capabilities

### New Capabilities
- `distance-range-alignment`: Alignment logic that correctly handles training descriptions with distance ranges (e.g. "5–6 km easy"), treating any actual distance within the range as aligned

### Modified Capabilities
- none

## Impact

- `apps/garmin-training/server/src/lib/alignment.ts` — logic change only, no interface changes
- Existing sessions with `not_aligned` status due to this bug will be corrected on next sync

## Stakeholders

- Garmin Training app (solo feature, no cross-team contracts)

## Non-goals

- Parsing pace ranges for distance (pace ranges are already handled separately)
- Changing the 10% deviation tolerance for single-distance sessions
