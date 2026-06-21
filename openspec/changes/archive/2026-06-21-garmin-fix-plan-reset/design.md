## Context

`PlanView` holds `syncMsg` as local component state (initializes to `''`). It also reads `planFilename`/`planStartDate` directly from `localStorage` on every render (not React state). When a new plan is uploaded, `UploadForm` writes new localStorage keys and calls `onUploaded`, but `PlanView` is never unmounted — its `syncMsg` state survives across uploads. Result: stale sync banner stays visible.

## Goals / Non-Goals

**Goals:**
- Clear `syncMsg` in `PlanView` on every new upload
- Clear `planFilename`/`planStartDate` from `localStorage` at the start of each upload

**Non-Goals:**
- Lifting `syncMsg` to App-level state (avoids unnecessary refactor)
- Resetting sync state on page reload
- Any multi-plan or plan history feature

## Decisions

**Decision: Force-remount `PlanView` on upload via React `key`**

`App` tracks an `uploadCount` integer (starts at 0). `PlanView` is rendered as `<PlanView key={uploadCount} .../>`. When `UploadForm` signals a new upload is starting (via an `onBeforeUpload` callback), `App` increments `uploadCount`, which React uses to unmount and remount `PlanView`. The remount resets all local state in `PlanView`, including `syncMsg`.

Alternatives considered:
- **Lift `syncMsg` to App**: Would work but adds prop drilling and couples App to PlanView's sync UX.
- **`useEffect` in PlanView watching sessions**: Can't reliably distinguish "sessions changed due to sync" vs "sessions changed due to new upload" — would clear sync message after every sync.
- **Pass a `resetSync` callback ref**: More wiring than the key approach for the same effect.

**Decision: Clear localStorage keys at upload start (before API call)**

`UploadForm.handleSubmit` removes `planFilename` and `planStartDate` from localStorage before calling `uploadPlan()`. After the API succeeds, new keys are written. This ensures a failed upload doesn't leave stale metadata from the prior plan either.

## Risks / Trade-offs

- `key`-based remount discards all `PlanView` local state, including `syncing` (in-flight sync button spinner). This is acceptable — a user uploading a new plan while a sync is in-flight is an edge case and the spinner would be confusing on a plan that no longer exists.
- Remounting `PlanView` is cheap (no API call on mount — sessions are passed as props).

## Migration Plan

No backend changes. Frontend-only. No database migration needed.

1. Add `onBeforeUpload` prop to `UploadForm`
2. Clear localStorage keys and call `onBeforeUpload` in `handleSubmit` before the API call
3. Add `uploadCount` state to `App`, increment in `onBeforeUpload` handler
4. Render `<PlanView key={uploadCount} .../>` in `App`
