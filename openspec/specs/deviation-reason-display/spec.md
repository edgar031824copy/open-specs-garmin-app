# Spec: Deviation Reason Display

## Purpose

Defines how the UI surfaces the `deviation_reason` field on training sessions that are not aligned with the plan. When a session misses its target, the reason text is displayed below the actual stats line so users understand why the session was flagged.

## Requirements

### Requirement: Deviation reason visible on not-aligned sessions
The UI SHALL display the `deviation_reason` string below the actual stats line for any session whose `alignment_status` is `not_aligned` and whose `deviation_reason` is non-null.

#### Scenario: Not aligned with reason — reason shown
- **WHEN** a session has `alignment_status: not_aligned` and a non-null `deviation_reason`
- **THEN** the reason text SHALL be rendered below the "Actual: X km @ Y/km" line

#### Scenario: Aligned session — no reason shown
- **WHEN** a session has `alignment_status: aligned`
- **THEN** no deviation reason SHALL be rendered regardless of field value

#### Scenario: Not aligned but reason is null — nothing shown
- **WHEN** a session has `alignment_status: not_aligned` and `deviation_reason` is `null`
- **THEN** no deviation reason line SHALL be rendered
