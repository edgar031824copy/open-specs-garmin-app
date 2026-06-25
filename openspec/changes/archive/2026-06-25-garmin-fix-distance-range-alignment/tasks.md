## 1. Update alignment logic (Backend)

- [x] 1.1 Replace `parsePlannedDistance` with `parseDistanceRange` in `alignment.ts` — returns `{ min, max }` for ranges, `{ min: n, max: n }` for single values, `null` if no match. Handle both `–` (em-dash) and `-` (hyphen).
- [x] 1.2 Update `computeAlignment` distance check to use `parseDistanceRange`: if actual falls within `[min, max]` → aligned; otherwise → not_aligned with deviation reason showing the range.
- [x] 1.3 Update `deviationReason` message for out-of-range case to include the range bounds (e.g. `distance_deviation: planned 5–6km, actual 4.30km`).
