## MODIFIED Requirements

### Requirement: System fetches Garmin activities for planned dates
The system SHALL use the garmin-connect npm package to retrieve the user's Garmin Connect activities for each date that has a planned session.

#### Scenario: Activity found for planned date
- **WHEN** a planned session date has a matching Garmin activity (same calendar date, activity type: running)
- **THEN** the system SHALL retrieve distance (km) and average pace (min/km) for that activity

#### Scenario: No activity found for planned date — session not yet confirmed
- **WHEN** no Garmin running activity exists for a planned session date AND the session's current `alignment_status` is `upcoming` or `missed`
- **THEN** the system SHALL mark that session as missed with `alignment_status=missed`

#### Scenario: No activity found for planned date — session already confirmed
- **WHEN** no Garmin running activity exists for a planned session date AND the session's current `alignment_status` is `aligned` or `not_aligned`
- **THEN** the system SHALL preserve the existing alignment data and NOT overwrite it with `missed`

#### Scenario: Garmin API authentication failure
- **WHEN** the garmin-connect package cannot authenticate with the credentials in env vars
- **THEN** the system SHALL return a 503 error with message "Garmin authentication failed"

### Requirement: Integration points
The system SHALL expose a REST endpoint for triggering Garmin sync.

#### Scenario: Sync endpoint called
- **WHEN** a client sends POST /api/sync
- **THEN** the system SHALL fetch and compare all planned sessions whose date is on or before today's local calendar date (derived from server local time, not UTC conversion) and return updated alignment statuses
