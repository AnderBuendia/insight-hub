# GitHub Copilot Instructions

Use the InsightHub harness in `AGENTS.md` as the repository-level workflow.

## Before Making Changes

- Read `AGENTS.md`.
- Read the relevant docs under `docs/`.
- Check `progress/current.md`.
- Treat JIRA as the intended source of truth for backlog state when available.
- Keep the work scoped to one task.

## Architecture Expectations

- `src/domain/` is pure TypeScript domain logic and must not import React,
  Next.js, infra, features, or shared code.
- `src/infra/` owns adapters and I/O.
- `src/features/` owns user-facing flows, page orchestration, UI, and state.
- `src/app/` composes routes and imports feature entrypoints.
- `src/shared/` is reusable and domain-agnostic.

## Testing Expectations

- Follow `docs/TESTING.md`.
- Co-locate tests with source files.
- Use Vitest and React Testing Library patterns already present in the repo.
- Keep coverage thresholds green.

## Verification

Prefer `./init.sh` for final verification. It validates the harness and runs the
project validation script.

For review comments, use `.github/copilot-review-prompt.md` and the automated
review context comment as additional input.
