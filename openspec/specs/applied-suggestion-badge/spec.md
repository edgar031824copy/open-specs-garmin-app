# applied-suggestion-badge Specification

## Purpose
TBD - created by archiving change garmin-ui-polish. Update Purpose after archive.
## Requirements
### Requirement: Session card displays "Applied" badge when suggestion is accepted
A Training Plan session card SHALL display a small "Applied" badge when a plan modification exists for that session date in the database (i.e., the user previously accepted a suggestion for it).

#### Scenario: Session with accepted suggestion shows badge
- **WHEN** a session card is rendered and the session date has a matching row in `plan_modifications`
- **THEN** the session card SHALL display an "Applied" badge (e.g., "✓ Applied") visually distinct from the alignment status badge

#### Scenario: Session without accepted suggestion shows no badge
- **WHEN** a session card is rendered and no matching row exists in `plan_modifications` for that session date
- **THEN** no "Applied" badge SHALL be shown on that card

#### Scenario: Badge is visible on upcoming sessions
- **WHEN** an upcoming session has an accepted suggestion
- **THEN** the "Applied" badge SHALL be visible alongside the "→ Upcoming" alignment status

#### Scenario: Badge is visible on past sessions
- **WHEN** a past session (aligned or not aligned) has an accepted suggestion
- **THEN** the "Applied" badge SHALL be visible alongside the existing alignment badge

### Requirement: Applied badge data comes from existing sessions response
The "Applied" badge SHALL be driven by data already returned by the `/api/sessions` endpoint — no additional API call is needed.

#### Scenario: Sessions response includes modification flag
- **WHEN** the frontend receives the sessions array
- **THEN** each session object SHALL include a field (e.g., `has_modification: boolean`) indicating whether an accepted suggestion exists
- **AND** the badge SHALL render based solely on this field

