## MODIFIED Requirements

### Requirement: Upload success persists metadata
On a successful plan upload, the upload flow SHALL write the uploaded filename and plan start date to `localStorage` (keys: `planFilename`, `planStartDate`) so downstream views can display upload context without re-fetching.

#### Scenario: Metadata written on success
- **WHEN** the user submits the upload form and the server returns a success response
- **THEN** `localStorage.setItem('planFilename', <filename>)` and `localStorage.setItem('planStartDate', <startDate>)` SHALL be called before the UI transitions to the plan view

#### Scenario: Metadata overwritten on re-upload
- **WHEN** the user uploads a second plan file
- **THEN** the previous `planFilename` and `planStartDate` values in `localStorage` SHALL be replaced with the new values
