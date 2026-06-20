## ADDED Requirements

### Requirement: Display upload metadata above session list
After a plan is uploaded, the app SHALL display the source filename and plan start date above the session table so the user can confirm what is currently loaded.

#### Scenario: Metadata visible after upload
- **WHEN** the user has previously uploaded a plan and the session list is shown
- **THEN** the filename and start date used for upload SHALL be displayed above the session rows

#### Scenario: No metadata shown when no plan loaded
- **WHEN** no plan has been uploaded in the current browser session
- **THEN** no metadata banner SHALL be displayed

#### Scenario: Metadata updates after re-upload
- **WHEN** the user uploads a new plan file
- **THEN** the displayed filename and start date SHALL reflect the new upload, not the previous one
