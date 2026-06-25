## Purpose

Defines how the system parses distance ranges from training descriptions and determines alignment when a planned session specifies a distance range rather than a single value.

## Requirements

### Requirement: Distance range parsing
The system SHALL parse training descriptions that contain a distance range (e.g. "5–6 km") and return both the minimum and maximum planned distance in km.

#### Scenario: Range pattern detected
- **WHEN** the training string contains a pattern like "5–6 km" or "5-6 km"
- **THEN** the parser SHALL return `{ min: 5, max: 6 }`

#### Scenario: Single distance falls back gracefully
- **WHEN** the training string contains a single distance like "6 km"
- **THEN** the parser SHALL return `{ min: 6, max: 6 }`

#### Scenario: No distance in string
- **WHEN** the training string contains no distance pattern
- **THEN** the parser SHALL return `null`

### Requirement: Aligned when actual distance is within planned range
The system SHALL mark a session as aligned when the actual distance falls within the planned distance range `[min, max]` (inclusive, with no additional tolerance needed when a range is present).

#### Scenario: Actual within range — aligned
- **WHEN** the planned range is "5–6 km" and the actual distance is 5.01 km
- **THEN** `alignment_status` SHALL be `aligned` and `deviation_reason` SHALL be `null`

#### Scenario: Actual at range boundary — aligned
- **WHEN** the planned range is "5–6 km" and the actual distance is exactly 5.0 km or 6.0 km
- **THEN** `alignment_status` SHALL be `aligned`

#### Scenario: Actual outside range — not aligned
- **WHEN** the planned range is "5–6 km" and the actual distance is 4.3 km
- **THEN** `alignment_status` SHALL be `not_aligned` and `deviation_reason` SHALL indicate the range deviation
