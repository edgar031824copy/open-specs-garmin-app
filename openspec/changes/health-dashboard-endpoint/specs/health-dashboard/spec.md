## ADDED Requirements

### Requirement: Health dashboard returns phase stats for all active changes
The system SHALL expose a `GET /health` endpoint that returns an array of phase completion stats, one entry per active change in `openspec/changes/`.

#### Scenario: Active changes exist
- **WHEN** a client sends `GET /health`
- **THEN** the system responds with HTTP 200 and a JSON array where each entry contains `name`, `status`, `artifactCount` (with `done` and `total` fields), and `lastUpdated` (ISO 8601 timestamp)

#### Scenario: No active changes exist
- **WHEN** a client sends `GET /health` and `openspec/changes/` contains only the `archive/` folder
- **THEN** the system responds with HTTP 200 and an empty array `[]`

### Requirement: Artifact count reflects done vs total artifacts
The system SHALL count an artifact as `done` when its output file exists on disk, and `total` as the number of artifacts defined by the change's schema.

#### Scenario: Partially complete change
- **WHEN** a change has 4 artifacts defined and 2 files written
- **THEN** `artifactCount` SHALL be `{ "done": 2, "total": 4 }`

### Requirement: Last updated reflects most recent artifact modification
The system SHALL set `lastUpdated` to the most recent file modification time across all artifact files in the change folder.

#### Scenario: Most recent artifact determines timestamp
- **WHEN** a change folder contains multiple artifact files with different mtimes
- **THEN** `lastUpdated` SHALL equal the mtime of the most recently modified file, formatted as ISO 8601
