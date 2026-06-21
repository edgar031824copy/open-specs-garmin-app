## MODIFIED Requirements

### Requirement: Accept persists suggestion and updates session
When the user accepts a suggestion, the system SHALL save the modification to `plan_modifications` AND update the matching `plan_sessions` row with `suggested_training`, then remove only that card from the suggestions list without re-generating all suggestions. Accepted sessions SHALL be permanently excluded from future suggestion generation — the backend MUST NOT return a new suggestion for a session whose `plan_sessions.suggested_training` is already set.

#### Scenario: Accept saves and updates session
- **WHEN** the user clicks Accept on a suggestion card
- **THEN** the suggestion SHALL be saved to `plan_modifications`
- **THEN** `plan_sessions.suggested_training` for the matching `session_date` SHALL be updated to the accepted value
- **THEN** the accepted card SHALL be removed from the suggestions list
- **THEN** no new suggestions SHALL be generated automatically

#### Scenario: Accepted session shows in plan view
- **WHEN** a suggestion has been accepted
- **THEN** the matching session in the plan view SHALL display the suggested training with the original training struck through

#### Scenario: Accepted session is excluded from suggestion generation
- **WHEN** `/api/suggestions` is called after a session has an accepted suggestion
- **THEN** the backend SHALL NOT include that session as a candidate for new suggestions
- **THEN** no suggestion card SHALL appear for a session with `suggested_training` already set
