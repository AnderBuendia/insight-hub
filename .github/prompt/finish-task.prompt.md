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

## Model Routing

Follow `docs/harness/model-routing.md`. Default to a mini-class model for this
prompt when the task is already implemented and verification evidence exists.
The closeout work is mostly deterministic: inspect the diff, summarize changes,
propose commits, fill the PR template, and draft the JIRA update.

Escalate to a stronger model only when evidence is missing or contradictory,
validation is red, the diff is complex enough to require product judgment, or
the JIRA status/transition policy is unclear.

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
10. Generate PR markdown using the exact section structure from
    `.github/pull_request_template.md`; document the implemented changes under
    its `## Changes` section.
11. Draft a JIRA update comment and transition recommendation when JIRA context
    is available. The default transition recommendation is `QA Testing`.
    Do not recommend `Done` unless the user explicitly approved final
    closeout after review.
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

Generate PR content with the same section order and headings as
`.github/pull_request_template.md`. Do not replace the repository template with
an alternate PR structure. Fill the template with concrete task details,
including the change documentation under `## Changes`.

```markdown
## Summary

Briefly explain what this PR does and why it exists.

**JIRA Ticket**: https://contactoanderbuendia.atlassian.net/browse/<KEY or XXXX>

## Context

What problem does this PR address?
Link to related issues, decisions, or documents if applicable.

## Changes

- Document the actual implementation changes here.
- Keep bullets concrete and aligned to the inspected `git diff`.

## Decisions

Important technical or product decisions made in this PR.
Explain trade-offs if relevant.

## Impact

- UI:
- Domain:
- Data flow:
- Performance:

## Risks / Considerations

Anything reviewers should pay special attention to?
Potential edge cases, follow-up work, or known limitations.

## Checklist

- [ ] Code is easy to understand
- [ ] Domain rules are respected
- [ ] No unnecessary coupling introduced
- [ ] Docs updated (if needed)
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
or explicitly asked for it. When transition approval exists, move completed
implementation work to `QA Testing`, not `Done`. `Done` is reserved
for explicit human-approved post-review closeout.

## Final Response

Return:

- Whether the task is ready to close.
- Validation commands and results.
- Proposed commits.
- PR markdown location or content.
- JIRA comment/transition recommendation.
- Any blockers.
