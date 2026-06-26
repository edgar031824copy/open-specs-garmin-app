## 1. Fix pace formatter

- [x] 1.1 In `apps/garmin-training/server/src/lib/alignment.ts` line 76, replace the `deviationReason` template literal: use `Math.floor(secs / 60)` for minutes and `String(secs % 60).padStart(2, '0')` for seconds on both `minSecs` and `maxSecs` (Backend)

## 2. Verify

- [x] 2.1 Confirm the app compiles without TypeScript errors (`npm run build` or `tsc --noEmit` from repo root) (Backend)
- [x] 2.2 Trigger a pace-misaligned session in the UI and confirm `deviation_reason` shows `MM:SS–MM:SS/km` format with no floats (Backend)
