## ADDED Requirements

### Requirement: Pace deviation reason uses MM:SS format
When a session is `not_aligned` due to pace, the `deviation_reason` field SHALL use `MM:SS` notation for both the lower and upper bounds of the planned pace range, with seconds zero-padded to two digits.

#### Scenario: Pace range with non-zero seconds formats correctly
- **WHEN** the planned pace range is `6:00–6:20/km` and the actual pace is outside that range
- **THEN** `deviation_reason` SHALL be `pace_deviation: target 6:00–6:20/km, actual <pace>/km`

#### Scenario: Seconds are zero-padded
- **WHEN** the pace minutes component is an integer and seconds is 0 (e.g., `6:00`)
- **THEN** the seconds component SHALL render as `00`, not `0`

#### Scenario: Pace range with on-the-minute values
- **WHEN** the planned pace is a whole minute (e.g., `5:00–6:00/km`)
- **THEN** both bounds SHALL render as `5:00` and `6:00` respectively — no floating-point digits
