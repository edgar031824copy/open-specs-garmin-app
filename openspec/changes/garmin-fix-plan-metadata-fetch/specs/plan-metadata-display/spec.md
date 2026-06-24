## MODIFIED Requirements

### Requirement: Display upload metadata above session list
After a plan is uploaded, the app SHALL display the source filename and plan start date above the session table so the user can confirm what is currently loaded. This metadata SHALL be fetched from the backend and SHALL be visible on any device, not only the one where the plan was uploaded.

#### Scenario: Metadata visible after upload on the same device
- **WHEN** the user has uploaded a plan and the session list is shown
- **THEN** the filename and start date SHALL be displayed above the session rows

#### Scenario: Metadata visible on a different device or incognito browser
- **WHEN** a user opens the app on a device with no prior localStorage state
- **THEN** the app SHALL fetch plan metadata from the backend and display the filename and start date if a plan exists in the DB

#### Scenario: No metadata shown when no plan loaded
- **WHEN** no plan has ever been uploaded (DB is empty)
- **THEN** no metadata banner SHALL be displayed

#### Scenario: Metadata updates after re-upload
- **WHEN** the user uploads a new plan file
- **THEN** the displayed filename and start date SHALL reflect the new upload, not the previous one
