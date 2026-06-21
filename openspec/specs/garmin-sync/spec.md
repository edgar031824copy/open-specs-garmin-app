## ADDED Requirements

### Requirement: System fetches Garmin activities for planned dates
The system SHALL use the garmin-connect npm package to retrieve the user's Garmin Connect activities for each date that has a planned session.

#### Scenario: Activity found for planned date
- **WHEN** a planned session date has a matching Garmin activity (same calendar date, activity type: running)
- **THEN** the system SHALL retrieve distance (km) and average pace (min/km) for that activity

#### Scenario: No activity found for planned date
- **WHEN** no Garmin running activity exists for a planned session date
- **THEN** the system SHALL mark that session as missed with alignment_status=missed

#### Scenario: Garmin API authentication failure
- **WHEN** the garmin-connect package cannot authenticate with the credentials in env vars
- **THEN** the system SHALL return a 503 error with message "Garmin authentication failed"

### Requirement: System determines alignment between planned and actual training
The system SHALL compare each actual Garmin activity against the planned session using distance and pace zone.

#### Scenario: Distance within 10% tolerance — aligned
- **WHEN** actual distance is within ±10% of planned distance AND actual pace falls within the planned pace range
- **THEN** alignment_status SHALL be set to aligned

#### Scenario: Distance deviation — not aligned
- **WHEN** actual distance deviates more than 10% from planned distance
- **THEN** alignment_status SHALL be set to not_aligned with reason distance_deviation

#### Scenario: Pace outside planned zone — not aligned
- **WHEN** actual average pace is outside the planned pace range by more than 10 seconds/km
- **THEN** alignment_status SHALL be set to not_aligned with reason pace_deviation

#### Scenario: Planned session has no pace target
- **WHEN** the Training column does not contain a pace range (e.g., just "12 km long run")
- **THEN** alignment SHALL be determined by distance only

### Requirement: Integration points
The system SHALL expose a REST endpoint for triggering Garmin sync.

#### Scenario: Sync endpoint called
- **WHEN** a client sends POST /api/sync
- **THEN** the system SHALL fetch and compare all past planned sessions up to today and return updated alignment statuses
