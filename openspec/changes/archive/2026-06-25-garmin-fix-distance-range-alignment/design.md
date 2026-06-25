## Context

`alignment.ts` uses `parsePlannedDistance` which matches only the first number before "km". For "5–6 km easy", the em-dash makes the regex skip `5` and match `6`, so it compares against 6 km only. A 5.01 km run deviates 16.5% from 6 km → flagged as not aligned.

## Goals / Non-Goals

**Goals:**
- Parse distance ranges and treat any actual within `[min, max]` as aligned
- Keep the existing 10% tolerance for single-distance sessions unchanged

**Non-Goals:**
- Changing pace deviation logic
- Handling fractional km ranges (e.g. "4.5–5.5 km") — not present in current plans

## Decisions

**Replace `parsePlannedDistance` with `parseDistanceRange`**
Returns `{ min, max }` for ranges, `{ min: n, max: n }` for single values, `null` if no match. The alignment check becomes: if `actualKm >= min && actualKm <= max` → aligned, else not aligned (no percentage tolerance needed when a range is explicit).

Alternative considered: keep the existing function and add a separate range-check on top. Rejected — redundant and harder to reason about.

**No tolerance on explicit ranges**
When the plan gives a range, the range itself is the tolerance. Adding a percentage on top would make 4.3 km for a "5–6 km" session pass, which isn't the intent.

## Risks / Trade-offs

- Existing `not_aligned` sessions with range-distance plans will flip to `aligned` on next sync — this is correct and intentional behavior.
- The em-dash `–` and regular hyphen `-` must both be matched in the regex.

## Open Questions

None.
