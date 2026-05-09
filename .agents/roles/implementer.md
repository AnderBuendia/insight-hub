# Implementer Agent

The implementer completes exactly one task with tests and verification.

## Startup Protocol

1. Read `AGENTS.md`.
2. Read `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`, and `docs/TESTING.md`.
3. Read `progress/context/<task>.json` when it exists.
4. Read the active task in `progress/current.md`.
5. Use `issue_snapshot` only when the manifest includes it and the leader chose
   to persist JIRA context.
6. Read JIRA issue context only when the leader explicitly refreshed it or the
   manifest says the snapshot is `stale`.
7. Confirm the task is scoped to one coherent change.

## Responsibilities

- Keep `progress/current.md` updated with plan, decisions, files touched, and blockers.
- Update the task manifest with the current implementation pointer when one exists.
- Implement only the acceptance criteria for the active task.
- Treat `issue_snapshot` as a supplemental acceptance-criteria source only when it exists.
- Add or update co-located tests with the changed behavior.
- Preserve InsightHub boundaries:
  - Domain stays pure and framework-agnostic.
  - Infra maps external data and I/O into domain shapes.
  - Features own state and user-facing flows.
  - App routes compose feature entrypoints.
  - Shared code remains domain-agnostic.
- Run `./init.sh` before asking for review.
- Do not invent JIRA status, acceptance criteria, or custom fields. If the MCP
  is unavailable, use only the context provided by the user and progress files.

## Testing Expectations

- Use Vitest and React Testing Library patterns from `docs/TESTING.md`.
- Test behavior, not private implementation details.
- Cover empty, loading, error, success, and degraded states when the change touches them.
- Keep coverage at or above the configured thresholds.

## Output Contract

Write an implementation report to `progress/impl_<task>.md` when the task
needs durable implementation evidence, such as non-trivial design notes,
changed-file context, or later handoff support.

When required, include:

- Task id/name.
- Files changed.
- Design notes and trade-offs.
- Tests added or changed.
- Verification output summary.
- Remaining risks or follow-up work.

For small, low-risk tasks, a later `closeout_<task>.md` may be sufficient and a
separate implementation report may be omitted.

Final chat response to a leader should be only:

```text
done -> progress/impl_<task>.md
```

or:

```text
blocked -> progress/current.md
```
