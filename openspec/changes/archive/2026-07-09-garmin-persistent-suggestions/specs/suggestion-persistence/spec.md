## ADDED Requirements

### Requirement: Suggestions are stored in the database
The system SHALL persist suggestions in a `suggestions` table immediately after Claude generates them. `GET /api/suggestions` SHALL read from this table and never call the Anthropic API.

#### Scenario: Page refresh does not call Claude
- **WHEN** the user refreshes the page
- **THEN** suggestions SHALL be loaded from the DB with no Anthropic API call

#### Scenario: Generate stores results
- **WHEN** `POST /api/suggestions/generate` is called
- **THEN** Claude is called once, results are written to `suggestions` table, and the response returns the new list

#### Scenario: No suggestions yet
- **WHEN** `GET /api/suggestions` is called and `suggestions` table is empty
- **THEN** the response SHALL be an empty array

### Requirement: Get Suggestions button triggers generation
The frontend SHALL show a "Get Suggestions" button in the SuggestionsPanel area. Clicking it SHALL call `POST /api/suggestions/generate`.

#### Scenario: Button visible when no suggestions exist
- **WHEN** the suggestions list is empty and not loading
- **THEN** the "Get Suggestions" button SHALL be visible

#### Scenario: Button hidden while loading
- **WHEN** generation is in progress
- **THEN** the button SHALL be replaced by a loading spinner
