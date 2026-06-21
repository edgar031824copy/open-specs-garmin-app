## Why

Runners following a structured training plan have no easy way to compare what they actually did against what was planned — and no tool that automatically adapts the remaining plan based on deviations. This app closes that gap by connecting a user-uploaded training plan with live Garmin activity data and using AI to suggest forward-looking adjustments.

## What Changes

- New web app under `apps/garmin-training/` — React frontend + Node.js/Express backend
- Users upload a CSV or XLS training plan (Week, Day, Training columns) and set a plan start date
- Backend fetches Garmin Connect activities for each planned day and compares distance and pace zone against the plan
- AI (Claude claude-sonnet-4-6) generates suggested modifications to upcoming sessions when a day is missed or underperformed
- Accepted modifications are persisted in Supabase so the plan evolves over time

## Stakeholders

- **User (solo runner):** sole consumer of the app — uploads plan, reviews comparisons, accepts/rejects suggestions
- **Garmin Connect:** external data source (unofficial API via `garmin-connect` npm package)
- **Anthropic API:** external AI service for generating plan modification suggestions
- **Supabase:** external persistence layer for plan rows and accepted modifications

## Non-goals

- Multi-user support — this is a single-user personal app
- Official Garmin OAuth integration — uses unofficial API for PoC
- Support for non-running activities (cycling, swimming, etc.)
- Automatic plan modification without user approval

## Capabilities

### New Capabilities

- `plan-upload`: Parse and store a CSV/XLS training plan; resolve Week+Day columns to calendar dates using a user-provided plan start date
- `garmin-sync`: Fetch actual Garmin activities for planned dates and compare distance and pace zone against the plan
- `training-suggestions`: Use Claude to generate suggested adjustments to upcoming sessions based on alignment results; allow user to accept or reject each suggestion
- `plan-view`: Display the current training plan with per-day alignment status and any accepted modifications

### Modified Capabilities

_(none — this is a new app with no existing specs affected)_

## Impact

- New app: `apps/garmin-training/` (React frontend, Express backend)
- New Supabase tables: `plan_sessions`, `plan_modifications`
- New env vars on Render: `GARMIN_EMAIL`, `GARMIN_PASSWORD`, `ANTHROPIC_API_KEY`, `DATABASE_URL`
- Dependencies: `garmin-connect`, `@anthropic-ai/sdk`, `pg`, `xlsx`, `papaparse`, `react`, `express`, `axios`
