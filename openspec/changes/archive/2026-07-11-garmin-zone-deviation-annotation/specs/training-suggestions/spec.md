## MODIFIED Requirements

### Requirement: Integration points
The suggestions capability depends on the garmin-sync capability for alignment data, the zone-deviation-annotation capability for zone deviation data, and the Anthropic API for generation.

#### Scenario: Anthropic API unavailable
- **WHEN** the Anthropic API returns an error or times out
- **THEN** the system SHALL display "Suggestions unavailable" and not crash the plan view

#### Scenario: Zone deviation included in suggestion context
- **WHEN** a past session has a non-null `zoneDeviation` annotation
- **THEN** the system SHALL include the deviation message in the Anthropic API prompt context for generating upcoming session suggestions
