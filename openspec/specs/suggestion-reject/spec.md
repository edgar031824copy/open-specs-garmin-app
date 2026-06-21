## ADDED Requirements

### Requirement: Reject dismisses card client-side only
When the user rejects a suggestion, the system SHALL remove only that card from the suggestions list. No server call SHALL be made and no suggestions SHALL be re-generated.

#### Scenario: Reject removes card immediately
- **WHEN** the user clicks Reject on a suggestion card
- **THEN** that card SHALL be removed from the suggestions list immediately
- **THEN** no API call SHALL be made
- **THEN** remaining suggestion cards SHALL be unaffected

#### Scenario: Rejected suggestion does not persist
- **WHEN** the user rejects a suggestion and refreshes the page
- **THEN** the rejected suggestion MAY reappear (rejection is not persisted — out of scope for this change)
