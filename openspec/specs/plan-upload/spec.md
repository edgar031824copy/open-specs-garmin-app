## ADDED Requirements

### Requirement: User can upload a training plan file
The system SHALL accept a CSV or XLS/XLSX file containing a training plan with columns: Week, Day, and Training.

#### Scenario: Valid CSV upload
- **WHEN** a user uploads a CSV file with Week, Day, and Training columns and provides a plan start date
- **THEN** the system SHALL parse the file, resolve each row to a calendar date, store all sessions in Supabase, and return a success response with the number of sessions imported

#### Scenario: Valid XLS upload
- **WHEN** a user uploads an XLS or XLSX file with the same column structure
- **THEN** the system SHALL parse it identically to a CSV upload

#### Scenario: Missing required columns
- **WHEN** a user uploads a file missing one or more of Week, Day, or Training columns
- **THEN** the system SHALL return a 400 error with a message identifying the missing columns

#### Scenario: Unsupported file format
- **WHEN** a user uploads a file that is not CSV, XLS, or XLSX
- **THEN** the system SHALL return a 400 error stating the supported formats

### Requirement: System resolves Week and Day columns to calendar dates
The system SHALL compute an exact calendar date for each plan row using the plan start date provided by the user and the Week/Day values in the file.

#### Scenario: Week 1 Monday with plan start date
- **WHEN** the plan start date is a Monday and a row has Week=1, Day=Monday
- **THEN** the resolved date SHALL equal the plan start date

#### Scenario: Week 2 Wednesday resolution
- **WHEN** the plan start date is Monday June 16 and a row has Week=2, Day=Wednesday
- **THEN** the resolved date SHALL be Wednesday June 25

#### Scenario: Friday/Saturday ambiguous day
- **WHEN** a row has Day=Friday/Saturday
- **THEN** the system SHALL resolve it to Friday of that week and flag it as flexible

### Requirement: Uploaded plan replaces any existing plan
The system SHALL overwrite the previously stored plan when a new file is uploaded.

#### Scenario: Re-upload clears prior data
- **WHEN** a user uploads a new plan file
- **THEN** all previous plan_sessions rows SHALL be deleted and replaced with the new upload
- **AND** accepted modifications from prior plan SHALL also be cleared

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
