## Why

When working with multiple active changes, there's no quick way to see the lifecycle state of each one — you have to inspect each change folder manually. A health dashboard endpoint surfaces this at a glance, enabling teams to spot stalled changes and measure lifecycle adherence.

## What Changes

- Adds a new `GET /health` endpoint that returns phase completion stats for all active changes
- Each entry in the response includes: change name, current phase status, artifact count (done vs. total), and last updated timestamp
- No changes to existing endpoints or artifact schemas

## Capabilities

### New Capabilities
- `health-dashboard`: Read-only endpoint returning phase completion stats per active change (status, artifact count, last updated)

### Modified Capabilities

## Impact

- New route handler in the API layer
- Reads from `openspec/changes/` directory at runtime (no database required)
- No breaking changes to existing CLI or artifact structure
