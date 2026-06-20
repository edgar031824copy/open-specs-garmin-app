## MODIFIED Requirements

### Requirement: System fetches Garmin activities for planned dates
The system SHALL use the garmin-connect npm package to retrieve the user's Garmin Connect activities for each date that has a planned session. For flexible sessions, the system SHALL check the activity against the primary date AND all alternate dates derived from the session's `Day` string.

#### Scenario: Activity found for primary planned date
- **WHEN** a planned session date has a matching Garmin running activity on the primary date
- **THEN** the system SHALL retrieve distance (km) and average pace (min/km) for that activity and mark the session as completed

#### Scenario: Activity found on alternate date for flexible session
- **WHEN** a planned session has `is_flexible = true` AND no Garmin running activity exists on the primary date AND a Garmin running activity exists on one of the alternate dates parsed from the `Day` string (e.g., `"Fri/Sat"` → Saturday)
- **THEN** the system SHALL retrieve distance (km) and average pace (min/km) for that activity and mark the session as completed

#### Scenario: No activity found for planned date
- **WHEN** no Garmin running activity exists on the primary date OR any alternate date for the session
- **THEN** the system SHALL mark that session as missed with alignment_status=missed

#### Scenario: Garmin API authentication failure
- **WHEN** the garmin-connect package cannot authenticate with the credentials in env vars
- **THEN** the system SHALL return a 503 error with message "Garmin authentication failed"
