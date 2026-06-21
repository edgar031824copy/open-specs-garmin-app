## 1. Loading State — App.tsx

- [x] 1.1 [Frontend] Add `sessionsLoading` boolean state to `App.tsx`; set to `true` before sessions fetch, `false` after
- [x] 1.2 [Frontend] Add `suggestionsLoading` boolean state to `App.tsx`; set to `true` before suggestions fetch, `false` after
- [x] 1.3 [Frontend] Pass `loading={sessionsLoading}` prop to `PlanView` and `loading={suggestionsLoading}` prop to `SuggestionsPanel`

## 2. Session Skeleton — PlanView.tsx

- [x] 2.1 [Frontend] Accept `loading?: boolean` prop in `PlanView`
- [x] 2.2 [Frontend] Add CSS `@keyframes` skeleton pulse animation inline (no external stylesheet)
- [x] 2.3 [Frontend] When `loading=true`, render 3 skeleton placeholder rows instead of the sessions list; rows should match session card height and border-radius

## 3. Suggestions Spinner — SuggestionsPanel.tsx

- [x] 3.1 [Frontend] Accept `loading?: boolean` prop in `SuggestionsPanel`
- [x] 3.2 [Frontend] Add CSS `@keyframes` spin animation inline
- [x] 3.3 [Frontend] When `loading=true`, render the panel with the "🤖 Suggested Adjustments" heading and a centered spinner in place of suggestion cards
- [x] 3.4 [Frontend] When `loading=false && list.length === 0`, keep existing behavior (panel hidden / returns null)

## 4. Applied Badge — SuggestionsPanel.tsx (revised: badge moved from session cards to suggestion cards)

- [x] 4.1 [Frontend] Remove "✓ Applied" badge from session cards in PlanView (strikethrough + 🤖 already communicates applied state)
- [x] 4.2 [Frontend] Pass `sessions` prop to SuggestionsPanel; derive `appliedDates` Set from sessions where `suggested_training !== null`
- [x] 4.3 [Frontend] On suggestion cards where `sessionDate` is in `appliedDates`: show "✓ Applied" badge, grey out card (opacity 0.65), green left border, hide Accept/Reject buttons

## 5. Verification

- [ ] 5.1 [Frontend] Upload a plan, confirm skeleton rows appear in session list during load and disappear when sessions arrive
- [ ] 5.2 [Frontend] Upload a plan, confirm spinner appears in Suggested Adjustments panel while suggestions are loading
- [ ] 5.3 [Frontend] Accept a suggestion, reload — confirm the session card shows "✓ Applied" badge
- [ ] 5.4 [Frontend] Reject a suggestion — confirm badge does not appear on that session card (no modification in DB)
