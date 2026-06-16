# open-specs

LIT-37 PoC — Spec-Driven Workflow Service using OpenSpec.

Demonstrates the OpenSpec lifecycle across two features:
- **Feature 1** (default path): Health dashboard endpoint — `propose → apply → sync → archive`
- **Feature 2** (expanded path): Garmin training comparison app — `new → ff → apply → verify → archive`

## Structure

```
openspec/         # OpenSpec planning home (changes, specs, config)
apps/
  health-dashboard/   # feature-1 implementation
  garmin-training/    # feature-2 implementation (coming)
docs/             # PoC observations, AC evidence, plan
```

## Running the app

```bash
npm install
npm run dev       # start server on port 3000
curl localhost:3000/health
```

## Running tests

```bash
npm test
```

## OpenSpec lifecycle

Managed via Claude Code slash commands (`/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`).
See `openspec/changes/` for active changes and `openspec/specs/` for the canonical spec.
