## Why

`computeAlignment()` only checks distance and pace against the plan text — it never looks at heart-rate zone data, so a session can be marked "Aligned" while the runner spent most of the time in the wrong zone (e.g. Z3/Z4 threshold effort on a planned Z2 easy day). Making zone-time a hard pass/fail rule would be too strict (legitimate drift from heat, fatigue, terrain), so instead we surface zone deviation as a non-blocking annotation that can inform the AI suggestion logic without changing `alignment_status`.

## What Changes

- Parse the target HR zone from the training description text (e.g. "Z2", "Zone 2") when present.
- Compute the percentage of session time spent in that target zone from the Garmin activity's time-in-zone data.
- Attach a `zone_deviation` annotation to the session (e.g. "Mostly Z3 instead of Z2 (74% vs 2%)") when actual zone-time diverges meaningfully from the target zone — displayed in the UI as a soft note, not an alignment failure.
- Pass `zone_deviation` into the AI suggestion prompt context so Claude's plan-adjustment suggestions can account for zone drift.
- `alignment_status` (aligned/not_aligned/missed) computation is unchanged — zone deviation never flips it.

## Capabilities

### New Capabilities
- `zone-deviation-annotation`: parses target zone from plan text, computes actual time-in-zone from Garmin data, and produces a non-blocking deviation annotation surfaced in the UI and fed to the suggestion prompt.

### Modified Capabilities
- `training-suggestions`: suggestion prompt context SHALL include zone deviation annotations when available, alongside existing distance/pace deviation data.

## Impact

- `apps/garmin-training/server/src/lib/alignment.ts`: add zone-target parsing and zone-deviation computation (new function, not part of `computeAlignment()`).
- Garmin sync path: needs access to per-activity time-in-zone data (already available from Garmin API per the screenshot's "Heart Rate Zones" panel) — may require adding a field if not already fetched.
- `apps/garmin-training/client`: Training Plan session card UI to render the new annotation (soft note, not a status badge).
- Suggestion generation prompt (Anthropic SDK call) to include zone deviation text.

## Stakeholders

- Garmin Training app team (sole owner/maintainer — solo PoC, no cross-team dependency for this change).

## Non-goals

- Not making zone-time part of `alignment_status` (aligned/not_aligned/missed) — stays a soft signal only.
- Not adding zone-based alerting, notifications, or historical zone trend analytics.
- Not supporting multi-zone or zone-range targets in plan text beyond a single named zone (e.g. "Z2") in this change.
