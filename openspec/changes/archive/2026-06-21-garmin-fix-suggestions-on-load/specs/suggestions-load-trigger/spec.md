## ADDED Requirements

### Requirement: Suggestions are fetched only after Sync
The system SHALL call `/api/suggestions` exclusively when the user triggers a Garmin sync, not on page load or on any other user action.

#### Scenario: Page load does not call suggestions
- **WHEN** the user loads or refreshes the page
- **THEN** the system SHALL fetch sessions but SHALL NOT call `/api/suggestions`
- **THEN** the suggestions panel SHALL display whatever suggestions are held in component state (initially empty)

#### Scenario: Sync Garmin triggers suggestions fetch
- **WHEN** the user clicks "Sync Garmin"
- **THEN** the system SHALL first complete the Garmin sync
- **THEN** the system SHALL call `/api/suggestions` to refresh the suggestions list

#### Scenario: Upload triggers suggestions fetch
- **WHEN** the user uploads a new training plan
- **THEN** the system SHALL call `/api/suggestions` after sessions are loaded, since new data warrants fresh suggestions
