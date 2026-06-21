## ADDED Requirements

### Requirement: Suggestions endpoint excludes accepted sessions
The suggestions endpoint SHALL exclude both deviated sessions AND upcoming sessions that already have an accepted modification from the data sent to Claude.

#### Scenario: Both deviated and upcoming filters applied
- **WHEN** the suggestions endpoint is called
- **THEN** the `deviatedSessions` query SHALL exclude session dates present in `plan_modifications`
- **AND** the `upcomingSessions` query SHALL also exclude session dates present in `plan_modifications`
- **AND** Claude SHALL only receive sessions with no prior accepted modification
