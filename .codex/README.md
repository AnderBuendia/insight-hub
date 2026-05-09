# Codex Harness Notes

Codex should treat the root `AGENTS.md` as the source of truth for repository
behavior.

## Default Flow

1. Run `./init.sh` before product-code changes.
2. Read `progress/current.md`.
3. Read `progress/context/<task>.json` when the active task has one.
4. Prefer manifest pointers as the default task context.
5. Work on exactly one task.
6. Keep `progress/current.md` updated.
7. Keep the task manifest aligned with the latest canonical reports when one exists.
8. Use the portable roles in `.agents/roles/` when delegating or reviewing.
9. Run `./init.sh` before marking implementation ready for review.
10. When JIRA is available, transition completed implementation to `QA Testing`,
   not `Done`, unless a human explicitly approves final closeout.

Load context on demand. Start with `progress/current.md`, the active task, and
the task manifest when present, then the files being edited. Read
`issue_snapshot` only when the manifest includes it and the task benefits from
a persisted JIRA brief. Refresh JIRA only when needed for snapshot refresh or
closeout. Read architecture,
conventions, testing, domain docs, and role files only when the task touches
those areas.

## Model Routing

Follow `docs/harness/model-routing.md` before delegating or choosing a model
class.

Use `.github/prompt/route-task.prompt.md` as the pre-flight classifier when a
task needs an explicit mini vs stronger routing decision before execution.

Use mini-class models for deterministic work such as
`.github/prompt/finish-task.prompt.md`, commit-message proposals, PR markdown,
JIRA update drafts, session-history formatting, mechanical docs updates,
checklist synchronization, and narrow search/report tasks.

Use a stronger model for ambiguous implementation, complex review, failing
validation, conflicting repository/JIRA evidence, security or data-integrity
risk, and irreversible external side effects.

## Role Mapping

- Planning and coordination: `.agents/roles/leader.md`
- Investigation: `.agents/roles/explorer.md`
- Implementation: `.agents/roles/implementer.md`
- Code review: `.agents/roles/reviewer.md`
- Executable validation review: `.agents/roles/validation-reviewer.md`

When using Codex subagents, ask them to write reports under `progress/`, update
the task manifest when one exists, and return only a pointer to the report.
