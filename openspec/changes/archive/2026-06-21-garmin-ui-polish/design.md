## Context

The Garmin Training app fires several sequential async requests (upload → sessions → suggestions → sync) with no visual feedback. The user sees a blank panel or a static list while requests are in flight, making the app feel broken or slow. Additionally, session cards that already have an accepted suggestion show the modified training but no explicit "Applied" label, leaving the user uncertain about what has been changed.

Current state:
- `App.tsx` tracks `sessions[]` and `suggestions[]` but has no loading state
- `SuggestionsPanel` returns `null` when list is empty — indistinguishable from "loading" vs "no suggestions"
- `PlanView` renders sessions immediately; no intermediate state
- Sessions query already JOINs `plan_modifications` and returns `suggested_training` per session — the badge data is already available client-side

## Goals / Non-Goals

**Goals:**
- Add loading skeleton to session list (PlanView) during sessions fetch
- Add spinner inside SuggestionsPanel while suggestions fetch is in flight
- Add "Applied" badge to session cards where `suggested_training` is non-null
- Zero new npm dependencies — pure CSS animations

**Non-Goals:**
- Loading state for the sync button (already handled by "Syncing…" button label)
- Error states or retry UI
- Persist rejected suggestions
- Backend changes — the sessions endpoint already returns `suggested_training` via JOIN

## Decisions

### 1. Loading state lives in App.tsx

`App.tsx` is the single owner of `sessions` and `suggestions`. Adding two boolean flags — `sessionsLoading` and `suggestionsLoading` — there and passing them as props keeps state co-located with the data fetches.

Alternative considered: local state inside each child component with its own fetch. Rejected — it would duplicate fetch logic and make coordinating the upload → sessions → suggestions chain harder.

### 2. Skeleton rows for sessions, spinner for suggestions

Skeleton rows in PlanView match the height and shape of real session cards, reducing layout shift when data arrives. A centered CSS spinner in SuggestionsPanel is enough — suggestions render as a panel, not a list of rows, so a skeleton adds no extra value there.

Both animations use CSS `@keyframes` defined inline via a `<style>` tag in each component. No external stylesheet or CSS module required.

### 3. "Applied" badge derived from `suggested_training !== null`

The sessions response already includes `suggested_training` from the `plan_modifications` LEFT JOIN. A non-null value means an accepted modification exists for that session. No new field or endpoint is needed — the badge renders when `s.suggested_training` is truthy.

The badge sits next to the alignment status label, right-aligned, styled as a small green pill ("✓ Applied").

Alternative considered: a dedicated `has_modification: boolean` field from the backend. Rejected — `suggested_training !== null` is equivalent and avoids a backend change.

### 4. Spinner appears only when `suggestions` prop is loading, not when list is empty

`SuggestionsPanel` currently returns `null` for an empty list. After this change:
- `loading=true` → show spinner
- `loading=false && list.length === 0` → show nothing (preserve current behavior; no suggestions = panel hidden)
- `loading=false && list.length > 0` → show suggestion cards

This avoids surfacing an empty panel to users who have no pending suggestions.

## Risks / Trade-offs

- **Skeleton count is hardcoded** — 3 skeleton rows are shown regardless of actual session count. If the user has 10 sessions the layout will shift more than expected. Acceptable for a single-user PoC demo.
  → Mitigation: none needed at this scale; revisit if the app gets a real user base.

- **CSS animation compatibility** — `@keyframes` works in all modern browsers. No risk for Chrome (demo target).

- **Badge depends on JOIN result** — if `plan_modifications` is empty (e.g., fresh upload clears it), `suggested_training` is null for all sessions and no badge appears. This is correct behavior.

## Migration Plan

1. Add `sessionsLoading` and `suggestionsLoading` state to `App.tsx`; pass as props
2. Update `PlanView` to accept `loading` prop and render skeleton rows when true
3. Update `SuggestionsPanel` to accept `loading` prop and render spinner when true
4. Add "Applied" badge to session cards in `PlanView` where `s.suggested_training !== null`
5. No backend changes, no migration, no rollback needed — purely additive frontend changes
