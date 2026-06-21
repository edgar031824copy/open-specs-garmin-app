## ADDED Requirements

### Requirement: Plan state is cleared on new upload
When a new plan file is uploaded, the application SHALL clear all sync-related state and plan metadata from both in-memory React state and `localStorage` before processing the upload response.

Sync state includes: sync result message, synced session count, and any displayed sync status. Plan metadata includes: `planFilename` and `planStartDate` localStorage keys.

#### Scenario: Sync state cleared before new upload response
- **WHEN** the user submits the upload form with a new plan file
- **THEN** the sync result message SHALL be reset to empty and the synced session count SHALL be reset to zero before the new upload response is applied to state

#### Scenario: localStorage plan keys cleared on new upload
- **WHEN** the user submits the upload form with a new plan file
- **THEN** `localStorage.removeItem('planFilename')` and `localStorage.removeItem('planStartDate')` SHALL be called at the start of the upload flow (before the response is processed)

#### Scenario: Stale sync banner not visible after re-upload
- **WHEN** the user uploads a second plan after a prior plan was synced
- **THEN** the sync status message from the prior sync SHALL NOT be visible after the new upload completes
