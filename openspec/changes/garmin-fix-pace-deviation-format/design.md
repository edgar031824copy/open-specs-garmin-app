## Context

`alignment.ts` computes a `deviationReason` string when a session's actual pace falls outside the planned range. The pace range is stored as `minSecs` and `maxSecs` (integer seconds/km). The bug is on the format line:

```ts
`pace_deviation: target ${paceRange.minSecs / 60}:${paceRange.minSecs % 60}–${paceRange.maxSecs / 60}:${paceRange.maxSecs % 60}/km`
```

`minSecs / 60` produces a float (e.g., `380 / 60 = 6.333...`). Only `minSecs % 60` is integer. The fix is a one-liner: use `Math.floor` for the minutes component and `String.padStart(2, '0')` for the seconds component.

## Goals / Non-Goals

**Goals:**
- Produce `MM:SS` pace strings (e.g., `6:00–6:20/km`) in all deviation reason outputs
- Zero-pad single-digit seconds (`:0` → `:00`)

**Non-Goals:**
- Changing pace tolerance thresholds
- Changing the `distance_deviation` format (already correct)
- Modifying database schema or API response shape

## Decisions

**Use `Math.floor` + `String.padStart`** — the simplest correct approach. Alternatives:
- Extract a `secsToMMSS(secs: number): string` helper — considered but overkill for a one-line change in a single call site. If pace formatting is needed elsewhere in the future, extracting a helper is the natural next step.

## Risks / Trade-offs

- `[Low]` Existing `deviation_reason` values already stored in Supabase will keep the malformed string. → Acceptable for PoC; no migration needed. Newly synced sessions will get the correct format.
