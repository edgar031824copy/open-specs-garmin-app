## MODIFIED Requirements

### Requirement: Plan view is accessible on mobile
The system SHALL render correctly on mobile screen widths (320px–430px) and SHALL display existing session data regardless of which device or browser session the plan was uploaded from.

#### Scenario: Mobile layout
- **WHEN** a user opens the app on a smartphone
- **THEN** all plan sessions SHALL be readable without horizontal scrolling and tap targets SHALL be at least 44px

#### Scenario: First visit on a new device or incognito browser
- **WHEN** a user opens the app on a device that has no prior localStorage state
- **THEN** the app SHALL still fetch sessions from the backend on mount and display any existing plan data
