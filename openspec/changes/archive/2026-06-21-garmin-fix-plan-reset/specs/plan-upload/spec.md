## MODIFIED Requirements

### Requirement: Upload success persists metadata
On a successful plan upload, the upload flow SHALL write the uploaded filename and plan start date to `localStorage` (keys: `planFilename`, `planStartDate`) so downstream views can display upload context without re-fetching.

Before writing new metadata, the upload flow SHALL clear any stale plan state (sync result, session count, prior localStorage values) to ensure the UI reflects only the newly uploaded plan.

#### Scenario: Metadata written on success
- **WHEN** the user submits the upload form and the server returns a success response
- **THEN** `localStorage.setItem('planFilename', <filename>)` and `localStorage.setItem('planStartDate', <startDate>)` SHALL be called before the UI transitions to the plan view

#### Scenario: Metadata overwritten on re-upload
- **WHEN** the user uploads a second plan file
- **THEN** the previous `planFilename` and `planStartDate` values in `localStorage` SHALL be replaced with the new values

#### Scenario: Stale state cleared before new metadata is written
- **WHEN** the user uploads a new plan file
- **THEN** sync state (sync result message, synced count) SHALL be reset and prior localStorage plan keys SHALL be removed before the new upload response is applied
