## ADDED Requirements

### Requirement: System parses a target heart-rate zone from plan text
The system SHALL parse a single named heart-rate zone (e.g. "Z2", "Zone 2") from a planned session's training description when present.

#### Scenario: Zone pattern detected
- **WHEN** the training string contains a pattern like "Z2" or "Zone 2"
- **THEN** the parser SHALL return `2` as the target zone number

#### Scenario: No zone in string
- **WHEN** the training string contains no zone pattern
- **THEN** the parser SHALL return `null` and no zone deviation SHALL be computed for that session

### Requirement: System computes actual time-in-zone for the matched activity
When a target zone is present for a session with a matched Garmin activity, the system SHALL fetch the actual time spent in each heart-rate zone for that activity and compute the percentage of session time spent in the target zone.

#### Scenario: Zone data available
- **WHEN** the zone-time fetch for the matched activity succeeds and returns non-empty data
- **THEN** the system SHALL compute `actualZonePercent` for the target zone

#### Scenario: Zone data unavailable or fetch fails
- **WHEN** the zone-time fetch returns no data or errors
- **THEN** `zoneDeviation` SHALL be `null` and no error SHALL be surfaced to the user

### Requirement: System annotates significant zone deviation without affecting alignment status
The system SHALL produce a non-blocking `zoneDeviation` annotation when the actual time spent in the target zone is below 50% of the session, and this annotation SHALL NOT alter `alignment_status`.

#### Scenario: Session mostly in wrong zone
- **WHEN** the target zone is Z2 and the actual activity spent 2% of its time in Z2 and 74% in Z3
- **THEN** `zoneDeviation` SHALL be `{ targetZone: 2, actualZonePercent: 2, message: "Mostly Z3 instead of Z2 (74% vs 2%)" }` and `alignment_status` SHALL remain unaffected by this computation

#### Scenario: Session mostly in target zone
- **WHEN** the target zone is Z2 and the actual activity spent 80% of its time in Z2
- **THEN** `zoneDeviation` SHALL be `null`

### Requirement: Zone deviation is surfaced in the Training Plan UI as a soft note
The Training Plan session card SHALL display the `zoneDeviation` message when present, visually distinct from the `Aligned`/`Not aligned` status badge.

#### Scenario: Deviation present
- **WHEN** a session has a non-null `zoneDeviation`
- **THEN** the UI SHALL render its `message` as a note on the session card without changing the existing alignment badge
