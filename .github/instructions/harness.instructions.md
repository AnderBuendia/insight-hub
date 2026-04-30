---
applyTo: "**"
---

# Harness Engineering Instructions

This repository uses the portable harness described in `AGENTS.md`.

For any non-trivial change:

- Work on one task at a time.
- Keep `progress/current.md` updated.
- Treat JIRA as the source of truth for backlog state when available.
- Use `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`, and `docs/TESTING.md` as
  the source of truth for implementation.
- Run `./init.sh` before considering the task complete.

When acting as a reviewer, prioritize bugs, regressions, layer-boundary
violations, missing tests, and verification gaps.
