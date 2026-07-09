## ADDED Requirements

### Requirement: Each suggestion has a status
Every row in the `suggestions` table SHALL have a `status` field with value `pending`, `accepted`, or `rejected`. Default is `pending`.

#### Scenario: New suggestion is pending
- **WHEN** `POST /api/suggestions/generate` inserts a new suggestion
- **THEN** its status SHALL be `pending`

### Requirement: Accept persists status
`POST /api/suggestions/accept` SHALL update the matching `suggestions` row to `status = accepted` in addition to writing to `plan_modifications`.

#### Scenario: Accepted suggestion survives refresh
- **WHEN** the user accepts a suggestion and refreshes the page
- **THEN** that suggestion SHALL NOT reappear in the pending list

### Requirement: Reject persists status
`POST /api/suggestions/reject` SHALL update the matching `suggestions` row to `status = rejected`.

#### Scenario: Rejected suggestion does not reappear
- **WHEN** the user rejects a suggestion and refreshes the page
- **THEN** that suggestion SHALL NOT reappear

### Requirement: Regeneration skips decided suggestions
`POST /api/suggestions/generate` SHALL NOT overwrite suggestions with `status = accepted` or `status = rejected`.

#### Scenario: Regenerate preserves accepted suggestion
- **WHEN** a suggestion is accepted and the user clicks "Get Suggestions" again
- **THEN** the accepted suggestion SHALL remain accepted and SHALL NOT be regenerated
