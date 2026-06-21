# loading-states Specification

## Purpose
TBD - created by archiving change garmin-ui-polish. Update Purpose after archive.
## Requirements
### Requirement: Session list shows skeleton while loading
The Training Plan section SHALL display skeleton placeholder rows while the sessions request is in flight after a plan upload or Garmin sync.

#### Scenario: Upload triggers session skeleton
- **WHEN** the user clicks "Upload Plan" and the upload request completes
- **THEN** the Training Plan section SHALL display at least 3 skeleton rows while the `/api/sessions` request is pending
- **AND** the skeleton rows SHALL disappear and be replaced by real session cards once the response arrives

#### Scenario: Sync triggers session skeleton
- **WHEN** the user clicks "Sync Garmin" and the sync request is in flight
- **THEN** the Training Plan section SHALL display skeleton rows while sessions reload
- **AND** the existing "Syncing..." button state remains visible alongside the skeleton

### Requirement: Suggestions panel shows spinner while loading
The "Suggested Adjustments" panel SHALL display a loading spinner in place of suggestion cards while the `/api/suggestions` request is in flight.

#### Scenario: Suggestions fetch is pending after upload
- **WHEN** the upload flow completes sessions fetch and triggers a suggestions fetch
- **THEN** the "Suggested Adjustments" panel SHALL display a visible spinner
- **AND** no empty panel or blank space SHALL be shown

#### Scenario: Suggestions fetch completes
- **WHEN** the `/api/suggestions` response arrives with one or more suggestions
- **THEN** the spinner SHALL be replaced by suggestion cards

#### Scenario: Suggestions fetch returns empty
- **WHEN** the `/api/suggestions` response arrives with zero suggestions
- **THEN** the spinner SHALL be replaced by a "No suggestions" or empty state message (no blank panel)

