## Context

`PlanSession.deviation_reason` is already typed and returned by the API. `PlanView.tsx` renders actual distance and pace but skips this field entirely.

## Goals / Non-Goals

**Goals:**
- Render `deviation_reason` for `not_aligned` sessions, below the actual stats line

**Non-Goals:**
- Prettifying or reformatting the reason string
- Backend changes

## Decisions

**Inline conditional render — no new component**
Add a single `{s.alignment_status === 'not_aligned' && s.deviation_reason && ...}` block inside the existing session card. The change is 3–4 lines and doesn't warrant extraction.

**Styling**
Small muted text, consistent with the existing "Actual:" line style (`fontSize: '0.8rem', color: '#888'`). A slight warning tint (`color: '#b8860b'`) makes it distinguishable without being aggressive.

## Risks / Trade-offs

- The reason string is raw (e.g. `distance_deviation: planned 5–6km, actual 5.01km`) — readable but not user-friendly prose. Acceptable for now per non-goals.

## Open Questions

None.
