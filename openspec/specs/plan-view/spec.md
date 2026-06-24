## Purpose

Displays the user's training plan sessions with alignment status, supports Garmin sync, and shows plan metadata.
## Requirements
### Requirement: Plan view displays all sessions with alignment status
The system SHALL render a list of all plan sessions showing the planned training, resolved date, and alignment status for past sessions.

#### Scenario: Past session with alignment data
- **WHEN** a session date is in the past and has been synced
- **THEN** the plan view SHALL show: date, planned training description, alignment_status badge (aligned/not_aligned/missed), and actual distance + pace if available

#### Scenario: Future session
- **WHEN** a session date is today or in the future
- **THEN** the plan view SHALL show: date, planned training description, and a "upcoming" badge — no alignment data

#### Scenario: Session with accepted modification
- **WHEN** a session has an accepted modification in plan_modifications
- **THEN** the plan view SHALL show the modified training description with a visual indicator that it was AI-suggested

### Requirement: Plan view is accessible on mobile
The system SHALL render correctly on mobile screen widths (320px–430px) and SHALL display existing session data regardless of which device or browser session the plan was uploaded from.

#### Scenario: Mobile layout
- **WHEN** a user opens the app on a smartphone
- **THEN** all plan sessions SHALL be readable without horizontal scrolling and tap targets SHALL be at least 44px

#### Scenario: First visit on a new device or incognito browser
- **WHEN** a user opens the app on a device that has no prior localStorage state
- **THEN** the app SHALL still fetch sessions from the backend on mount and display any existing plan data

### Requirement: User can trigger a Garmin sync from the plan view
The system SHALL provide a sync button that fetches the latest Garmin data and updates alignment statuses.

#### Scenario: Sync button pressed
- **WHEN** a user taps the Sync button
- **THEN** the system SHALL call POST /api/sync, show a loading state, and refresh the plan view on completion

