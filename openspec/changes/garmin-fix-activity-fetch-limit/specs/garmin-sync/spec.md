## MODIFIED Requirements

### Requirement: Sync fetches enough activities to cover the full plan
The sync process SHALL fetch a sufficient number of recent Garmin activities so that no past session within the training plan is omitted due to a fetch limit.

#### Scenario: Plan has more than 20 past sessions
- **WHEN** the user has more than 20 Garmin activities since the plan start date
- **THEN** all plan sessions with a `session_date` on or before today are evaluated against actual activities, and none are incorrectly marked as missed solely due to the fetch window
