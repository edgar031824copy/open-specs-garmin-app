## Context

After a plan is uploaded the session list renders with no indication of which file or start date was used. The user must remember this context externally. The fix is frontend-only: persist metadata in `localStorage` on upload and read it back in `PlanView`.

## Goals / Non-Goals

**Goals:**
- Store `planFilename` and `planStartDate` in `localStorage` on upload success
- Display both values in `PlanView` above the session table
- Clear/overwrite on subsequent uploads

**Non-Goals:**
- Backend or database changes
- Multi-user or cross-device persistence
- Displaying metadata in sync or suggestions views

## Decisions

**localStorage over React state** — Metadata survives page refresh without requiring a backend call. Acceptable for a single-user PoC; state-in-memory would be lost on reload.

**Two flat keys (`planFilename`, `planStartDate`) over a single JSON key** — Simpler reads; each component can grab only what it needs without parsing.

**Display in PlanView, not App.tsx** — Keeps the metadata display co-located with the session table it contextualizes. App.tsx would require prop-drilling with no benefit.

## Risks / Trade-offs

- **Stale localStorage across resets** → Acceptable: re-uploading overwrites. Manual clear via DevTools if needed.
- **No validation of stored date format** → `planStartDate` is written by `UploadForm` which already validates format before calling the API, so format is safe.

## Migration Plan

No migration required — localStorage is client-side. Deploy frontend; existing sessions without metadata will show no banner (graceful degradation).

## Open Questions

None — scope is fully determined.
