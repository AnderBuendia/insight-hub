---
applyTo: "**"
---

# Harness Engineering Instructions

This repository uses the portable harness described in `AGENTS.md`.

For any non-trivial change:

- Work on one task at a time.
- Keep `progress/current.md` updated.
- Prefer `progress/context/<task>.json` over scanning `progress/` when a task
  manifest exists.
- Treat manifest pointers as the default local context.
- Read `issue_snapshot` only when the manifest includes it and the task benefits from a persisted JIRA brief.
- Treat JIRA as the source of truth for backlog state when available.
- Refresh JIRA only on initial materialization, explicit refresh, closeout, or
  when an optional snapshot is marked `stale`.
- Load context on demand: use `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`,
  and `docs/TESTING.md` when the task touches architecture, conventions, or
  tests.
- Run `./init.sh` before considering the task complete.
- Move verified implementation work to `QA Testing` in JIRA, not `Done`,
  unless a human explicitly approves final closeout.
- Follow `docs/harness/model-routing.md` for mini vs stronger model selection.
  Use `.github/prompt/route-task.prompt.md` when a pre-flight routing decision
  is needed.
  Prefer mini-class models for deterministic evidence-driven work and escalate
  when evidence is missing, validation is red, or judgment is needed.

When acting as a reviewer, prioritize bugs, regressions, layer-boundary
violations, missing tests, and verification gaps.
