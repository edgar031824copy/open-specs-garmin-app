## ADDED Requirements

### Requirement: Accepted upcoming sessions are excluded from suggestion generation
The suggestions endpoint SHALL exclude upcoming sessions that already have an entry in `plan_modifications` from the list passed to Claude for suggestion generation.

#### Scenario: Accepted upcoming session is not re-suggested
- **WHEN** a user has accepted a suggestion for an upcoming session (row exists in `plan_modifications` for that `session_date`)
- **AND** the user triggers a new suggestions fetch (via sync or upload)
- **THEN** that session SHALL NOT appear in the suggestions response

#### Scenario: Unaccepted upcoming sessions are still suggested
- **WHEN** an upcoming session has no entry in `plan_modifications`
- **THEN** that session SHALL still be passed to Claude and may appear in the suggestions response
