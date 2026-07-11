## ADDED Requirements

### Requirement: System generates AI suggestions for upcoming sessions after non-aligned days
The system SHALL call the Anthropic API (claude-sonnet-4-6) to generate modification suggestions for upcoming planned sessions when a past session was not_aligned or missed.

#### Scenario: Missed session triggers suggestion
- **WHEN** a planned session has alignment_status=missed
- **THEN** the system SHALL generate a suggestion for at least one upcoming session that compensates for the missed volume

#### Scenario: Not-aligned session triggers suggestion
- **WHEN** a planned session has alignment_status=not_aligned
- **THEN** the system SHALL generate a suggestion describing how to adjust upcoming sessions based on the deviation type (distance or pace)

#### Scenario: Aligned session produces no suggestion
- **WHEN** a planned session has alignment_status=aligned
- **THEN** the system SHALL not generate any suggestion for that session

### Requirement: User can accept or reject each suggestion
The system SHALL present each suggestion individually and allow the user to accept or reject it.

#### Scenario: User accepts suggestion
- **WHEN** a user clicks Accept on a suggestion
- **THEN** the system SHALL store the modification in Supabase plan_modifications table and update the affected session display in the plan view

#### Scenario: User rejects suggestion
- **WHEN** a user clicks Reject on a suggestion
- **THEN** the suggestion SHALL be dismissed and the original planned session SHALL remain unchanged

### Requirement: Integration points
The suggestions capability depends on the garmin-sync capability for alignment data, the zone-deviation-annotation capability for zone deviation data, and the Anthropic API for generation.

#### Scenario: Anthropic API unavailable
- **WHEN** the Anthropic API returns an error or times out
- **THEN** the system SHALL display "Suggestions unavailable" and not crash the plan view

#### Scenario: Zone deviation included in suggestion context
- **WHEN** a past session has a non-null `zoneDeviation` annotation
- **THEN** the system SHALL include the deviation message in the Anthropic API prompt context for generating upcoming session suggestions
