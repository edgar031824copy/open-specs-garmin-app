## 1. Backend — Update Accept Handler [Backend]

- [x] 1.1 In `suggestions.ts` `POST /accept`, after inserting into `plan_modifications`, add `UPDATE plan_sessions SET suggested_training = $1 WHERE session_date = $2` using `suggestedTraining` and `sessionDate`

## 2. Frontend — Local State for Suggestion List [Frontend]

- [x] 2.1 In `SuggestionsPanel.tsx`, add `const [list, setList] = useState(suggestions)` initialized from the prop; replace all `suggestions.map(...)` references with `list.map(...)`
- [x] 2.2 Add `useEffect(() => setList(suggestions), [suggestions])` so the list resets when the parent re-fetches

## 3. Frontend — Accept Action [Frontend]

- [x] 3.1 In `handleAccept`, after `await acceptSuggestion(s)`, call `setList(prev => prev.filter(x => x.sessionDate !== s.sessionDate))` to remove the card
- [x] 3.2 Replace `onAction()` in `handleAccept` with `onAccepted()` (sessions-only refresh — see task 4.1)

## 4. Frontend — Reject Action [Frontend]

- [x] 4.1 In `handleReject`, remove the `await rejectSuggestion()` call and replace `onAction()` with `setList(prev => prev.filter((_, i) => i !== index))` — pass `index` from the `map` callback
- [x] 4.2 Remove the `rejectSuggestion` import from `api.ts` usage in this component (keep the function in api.ts, just stop calling it)

## 5. Frontend — Wire onAccepted in App.tsx [Frontend]

- [x] 5.1 In `App.tsx`, replace the `onAction={loadData}` prop on `SuggestionsPanel` with `onAccepted={() => fetchSessions().then(r => setSessions(r.data))}`

## 6. Verify [Frontend + Backend]

- [x] 6.1 Accept a suggestion — confirm the card disappears, the session in the plan view shows the suggestion with original struck through, and no new suggestions appear
- [x] 6.2 Reject a suggestion — confirm the card disappears immediately with no network call and no new suggestions appear
- [x] 6.3 Confirm remaining cards are unaffected after either action
