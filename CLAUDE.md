# open-specs

This repo is a PoC for **LIT-37 (Spec-Driven Workflow Service)** — validating that OpenSpec can serve as a reusable lifecycle for cross-team feature delivery across teams (AISDLC). Reporter: Mariana Santamaría.

**Main goal:** Prove that two different features can follow the same OpenSpec lifecycle, each phase producing a versioned artifact, and the lifecycle plugs into different targets (Solo / Team / Scale) without forking.

Acceptance criteria:
1. Two features follow the same lifecycle with phase-visible artifacts
2. Each phase produces a versioned artifact against a schema
3. Lifecycle plugs into different targets (Solo / Team / Scale) without forking
4. Demo to Labs team + Lunch & Learn
5. Published article on architecture pattern + PoC data

## Features

### Feature 1 — Health Dashboard Endpoint ✅ COMPLETE
- **Path:** OPSX default (`propose → apply → sync → archive`)
- **Scope:** Backend-only, adds a `/health` endpoint returning active change stats
- **Artifacts:** `openspec/changes/archive/2026-06-16-health-dashboard-endpoint/`
- **App:** `apps/health-dashboard/`
- **Key learning:** Default path generates tasks assuming existing scaffolding — update `config.yaml` context before running propose.

### Feature 2 — Garmin Training Comparison 🔄 IN PROGRESS
- **Path:** OPSX expanded (`new → ff → apply → verify → archive`)
- **Scope:** Full-stack app — user uploads CSV/XLS running plan, app calls Garmin API to check alignment with actual activities, Claude suggests adjustments for upcoming sessions
- **Artifacts:** `openspec/changes/garmin-training-comparison/`
- **App:** `apps/garmin-training/` (server on :3001, client on :5173)
- **Status:** Code complete, end-to-end local test in progress (task 6.1)
- **Key learning:** Expanded path lets you pause between steps and review config — better for first-time use and proving per-phase artifact creation.

The contrast between the two features (default vs expanded path, Solo vs Team target) is the core demo and article material.

## Active change

Feature 2: `garmin-training-comparison` (expanded path, Team target)
- Change artifacts: `openspec/changes/garmin-training-comparison/`
- App code: `apps/garmin-training/`
- Status: apply in progress — end-to-end test pending

## Apply rule (CRITICAL)

Any inline fix — bug, wrong version, type error, wrong assumption — must be tracked as a **new OpenSpec change**, not a freeform note:

```
/opsx:new fix-<issue> → /opsx:ff → /opsx:apply → /opsx:archive
```

Then return to the original change. This keeps fixes as first-class artifacts with their own proposal, tasks, and archive entry.

**Exception:** Pure generation errors (typos, missing imports, obvious compilation errors fixable in under 2 minutes) may be fixed inline without a new change.

**Historical note:** Fixes made before this rule was established are documented in `openspec/changes/garmin-training-comparison/tasks.md` under `## Known Issues Fixed During Apply` — that section is legacy, not the current pattern.

This rule is defined in `openspec/config.yaml` under `rules.apply`.

## Repo structure

```
openspec/
  changes/
    archive/2026-06-16-health-dashboard-endpoint/   # Feature 1 (archived)
    garmin-training-comparison/                      # Feature 2 (active)
      proposal.md, design.md, tasks.md
      specs/plan-upload, garmin-sync, training-suggestions, plan-view
  specs/health-dashboard/spec.md                    # Main spec from Feature 1
  config.yaml                                       # Team target + apply rules
apps/
  health-dashboard/                                 # Feature 1 complete
  garmin-training/
    server/                                         # Express + Supabase + Garmin + Anthropic
    client/                                         # React + Vite
```

## Running locally

```bash
npm run dev        # starts both server (:3001) and client (:5173)
```

Backend env vars are in `apps/garmin-training/server/.env` (not committed).
