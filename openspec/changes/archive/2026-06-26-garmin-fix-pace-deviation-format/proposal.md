## Why

The `deviation_reason` field for pace-misaligned sessions displays malformed pace strings like `6:0–6.3333333333333333:20/km` instead of `6:00–6:20/km`. This happens because `alignment.ts` uses float division (`minSecs / 60`) to reconstruct the minutes component, producing repeating decimals for any pace with non-zero seconds.

## What Changes

- Fix the pace range formatter in `alignment.ts` to use integer arithmetic (`Math.floor`) for minutes and zero-pad seconds to two digits
- No API contract changes — `deviation_reason` is already a string field; only its content improves

## Capabilities

### New Capabilities
- `pace-deviation-format`: Human-readable pace range string in deviation reasons (e.g., `6:00–6:20/km` instead of `6.333...:20/km`)

### Modified Capabilities
- None — no spec-level behavior changes; the field existed and was already rendered in the UI

## Impact

- **Code:** `apps/garmin-training/server/src/lib/alignment.ts`, line 76 — `deviationReason` construction in pace check branch
- **UI:** `PlanView.tsx` deviation reason display will automatically show the corrected string — no UI change needed
- **APIs:** `/api/sessions` response content improves; shape unchanged
- **Stakeholders:** Garmin Training app only — no cross-team contracts affected

## Stakeholders

- Edgar Hernandez (sole developer / PoC owner)

## Non-goals

- Changing the pace tolerance logic
- Reformatting other deviation reason strings (`distance_deviation` is already correct)
- Localizing pace format
