---
name: finish-harness-task
description: "Finish one InsightHub Harness Engineering task: validate, review evidence, prepare commits, PR text, and JIRA update."
argument-hint: "JIRA key or short task label"
disable-model-invocation: false
---

# Finish Harness Task

Use this prompt when one implementation task is ready to close.

You are operating inside the InsightHub Harness Engineering workflow. Use English
for all generated repository artifacts.

## Inputs

- Task identifier: `$ARGUMENTS`
- Repository harness: `AGENTS.md`
- Session state: `progress/current.md`
- Implementation report: `progress/impl_<task>.md` when present
- Code review report: `progress/review_<task>.md` when present
- Validation report: `progress/validation_<task>.md` when present
- PR template: `.github/pull_request_template.md`
- JIRA context: fetch through the JIRA MCP when available

## Required Flow

1. Read `AGENTS.md`, `CHECKPOINTS.md`, and `progress/current.md`.
2. Identify the active task:
   - Prefer the JIRA issue key from `$ARGUMENTS` or `progress/current.md`.
   - If JIRA MCP is available, fetch the issue and use its title, description,
     acceptance criteria, status, and links.
   - If JIRA MCP is not available, explicitly state that JIRA context is unavailable.
3. Inspect `git diff --stat` and `git diff` to understand the actual changes.
4. Read existing reports in `progress/` for the task.
5. Run `./init.sh`.
6. Run `npm run build` if the change touches routing, rendering, Next.js config,
   environment behavior, or production-only behavior.
7. Check whether a validation reviewer report exists:
   - If missing for a substantial code/UI change, create or request
     `progress/validation_<task>.md`.
   - Until browser automation exists, record browser/manual validation as
     `not available`, not as pass.
8. Confirm no unrelated changes are mixed into the task.
9. Propose atomic commits using Conventional Commits.
10. Generate PR markdown using `.github/pull_request_template.md`.
11. Draft a JIRA update comment and transition recommendation when JIRA context
    is available.
12. Update `progress/history.md` with the closing summary.
13. Reset `progress/current.md` only after validation is green and the user has
    accepted the closure path.

## Commit Guidance

Use small, intentional commits. Prefer:

```text
feat(harness): add validation reviewer role
docs(harness): document jira mcp integration
test(analysis): cover url filter parsing
```

Do not create commits without user approval unless the user explicitly asked you
to finish and commit.

## PR Output

Generate PR content with these sections, matching the repository template where
possible:

```markdown
## Summary

- ...

## JIRA

- Issue: <KEY or "Unavailable">
- Status before PR:
- Suggested update:

## Context

## Changes

## Decisions

## Impact

- UI:
- Domain:
- Data flow:
- Performance:
- Harness/agent workflow:

## Validation

- `./init.sh`: pass/fail
- `npm run build`: pass/fail/not required
- Browser validation: pass/fail/not available

## Risks / Considerations

## Checklist

- [ ] One task only
- [ ] Tests and coverage pass
- [ ] Layer boundaries respected
- [ ] JIRA update prepared or applied
- [ ] progress/history.md updated
```

## JIRA Update Draft

When JIRA MCP is available, prepare a concise comment:

```markdown
Implementation ready for review.

Summary:
- ...

Validation:
- `./init.sh`: pass
- `npm run build`: pass/not required
- Browser validation: not available until automation is added

PR:
- <link when available>
```

Do not transition a JIRA issue unless the user has approved the transition policy
or explicitly asked for it.

## Final Response

Return:

- Whether the task is ready to close.
- Validation commands and results.
- Proposed commits.
- PR markdown location or content.
- JIRA comment/transition recommendation.
- Any blockers.
