## ADDED Requirements

### Requirement: Backend deployed on Render
The system SHALL run the Express backend as a Render Web Service with a stable public URL.

#### Scenario: Health check passes after deploy
- **WHEN** the Render service finishes deploying
- **THEN** `GET <render-url>/health` returns `{"status":"ok"}` with HTTP 200

#### Scenario: Backend reads PORT from environment
- **WHEN** Render sets the `PORT` environment variable
- **THEN** the server binds to that port without code changes

### Requirement: Frontend deployed on Netlify
The system SHALL serve the React/Vite client as a Netlify static site with a stable public URL.

#### Scenario: Frontend loads after deploy
- **WHEN** a user visits the Netlify URL
- **THEN** the app loads and the upload form is visible

#### Scenario: SPA routes resolve correctly
- **WHEN** a user navigates directly to any client-side route
- **THEN** Netlify serves `index.html` instead of returning 404

### Requirement: Frontend communicates with deployed backend
The system SHALL configure the frontend to call the Render backend URL in production.

#### Scenario: API calls reach the Render backend
- **WHEN** the frontend is built with `VITE_API_URL` set to the Render service URL
- **THEN** all `axios` calls in `api.ts` are prefixed with that URL

### Requirement: CORS restricted to Netlify origin
The backend SHALL restrict CORS to the Netlify frontend domain in production.

#### Scenario: Requests from Netlify domain succeed
- **WHEN** the frontend at the Netlify URL sends an API request
- **THEN** the backend responds with the correct `Access-Control-Allow-Origin` header

#### Scenario: CORS falls back to open in local dev
- **WHEN** `ALLOWED_ORIGIN` env var is not set
- **THEN** the backend accepts requests from any origin (local dev behavior preserved)

### Requirement: Secrets stored in Render environment
The backend SHALL read all credentials from environment variables set in the Render dashboard.

#### Scenario: App starts without a .env file
- **WHEN** the Render service starts with env vars configured in the dashboard
- **THEN** the server connects to Supabase, Garmin, and Anthropic without a committed `.env` file
