## Why

The app fires several dependent async requests (upload → sessions → suggestions → sync) with no visual feedback, making the UI feel frozen or broken during loading. Additionally, when a suggestion has already been accepted, there is no indicator on the session card — the user can't tell what has already been applied.

## What Changes

- Show skeleton rows in the Training Plan list while sessions are loading after upload
- Show a spinner inside the "Suggested Adjustments" panel while the suggestions request is in flight (currently renders empty silently)
- Show an "Applied" badge on Training Plan session cards that have an accepted suggestion (rows that display the 🤖 adjusted training)

## Capabilities

### New Capabilities
- `loading-states`: Skeleton and spinner states for the upload flow (session list) and the suggestions fetch (adjustments panel)
- `applied-suggestion-badge`: Visual badge on session cards in PlanView indicating a suggestion has already been accepted for that session

### Modified Capabilities
- `plan-view`: Session cards gain a new optional badge when a modification exists for that session date

## Impact

- Frontend only: `App.tsx`, `PlanView.tsx`, `SuggestionsPanel.tsx`
- No backend changes, no new API endpoints
- No new dependencies — plain CSS + inline SVG spinner or CSS animation

## Stakeholders

- Edgar Hernandez (sole user of this app for the PoC)
- LIT-37 demo audience (UX polish before recording)

## Non-goals

- Skeleton screens for the Garmin sync result rows (already has "Syncing..." button state)
- Toast notifications or error states
- Persist rejected suggestions across sessions
