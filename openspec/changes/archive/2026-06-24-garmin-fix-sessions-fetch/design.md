## Context

`App.tsx` gates the `fetchSessions()` call behind `localStorage.getItem('planFilename')`. This key is only set after a successful plan upload on the current browser. Any fresh context (incognito, mobile, new device) never fires the API call, making the app appear empty even when data exists in Supabase.

## Goals / Non-Goals

**Goals:**
- Sessions are always fetched on mount, making the app data-driven rather than localStorage-driven
- `planFilename` in localStorage remains the source for the filename banner (display only)

**Non-Goals:**
- No authentication or multi-user support
- No offline/cached data strategy
- No changes to the backend or database

## Decisions

**Remove the localStorage guard from `useEffect`**

Before:
```ts
useEffect(() => {
  if (localStorage.getItem('planFilename')) loadSessions();
}, [loadSessions]);
```

After:
```ts
useEffect(() => {
  loadSessions();
}, [loadSessions]);
```

The guard was added to avoid a loading flash on first visit (no plan yet). The trade-off is incorrect: silently hiding real data is worse than an empty-state flicker. The empty state ("No sessions yet") renders correctly when the API returns `[]`, so there is no UX regression on a truly empty DB.

## Risks / Trade-offs

- **Extra API call on truly empty DB** → negligible; the endpoint is fast and returns `[]`
- **Render cold start on first load** → request may take 30–50s if the backend was dormant; the existing loading state already handles this
