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
- Task context manifest: `progress/context/<task>.json` when present
- Implementation report: `progress/impl_<task>.md` when present
- Code review report: `progress/review_<task>.md` when present
- Validation report: `progress/validation_<task>.md` when present
- Closeout report: `progress/closeout_<task>.md` when present
- PR template: `.github/pull_request_template.md`
- JIRA context: use local pointers first; read the manifest snapshot only when
  present; fetch through the JIRA MCP only when the snapshot is missing, marked
  `stale`, or closeout needs live data

## Required Flow

1. Read `AGENTS.md`, `CHECKPOINTS.md`, `progress/current.md`, and the task manifest when present.
2. Identify the active task:
   - Prefer the JIRA issue key from `$ARGUMENTS` or `progress/current.md`.
   - Use manifest pointers as the default local context.
   - If the manifest has `issue_snapshot`, use it as an optional local JIRA brief.
   - If JIRA MCP is available and the snapshot is missing, marked `stale`, or
     the closeout step needs live status, fetch the issue and refresh the brief.
   - If JIRA MCP is not available, explicitly state that JIRA context is unavailable.
3. Inspect `git diff --stat` and `git diff` to understand the actual changes.
4. Read the reports referenced by the task manifest when present. Fall back to the matching files in `progress/`.
5. Run `./init.sh`.
6. Run `npm run build` if the change touches routing, rendering, Next.js config,
   environment behavior, or production-only behavior.
7. Check whether a validation reviewer report exists:
   - If missing for a substantial code/UI change, create or request
     `progress/validation_<task>.md`.
   - Until browser automation exists, record browser/manual validation as
     `not available`, not as pass.
8. Decide which detailed reports are required:
   - Use only `progress/closeout_<task>.md` for small, low-risk, one-session tasks.
   - Require `progress/impl_<task>.md` when changed-file context, design notes,
     or durable implementation evidence matter.
   - Require `progress/review_<task>.md` when review findings or an approval
     record matter.
   - Require `progress/validation_<task>.md` when validation evidence needs
     more than a one-line summary.
9. Confirm no unrelated changes are mixed into the task.
10. Propose atomic commits using Conventional Commits.
11. Generate PR markdown using the exact section structure from
    `.github/pull_request_template.md`; document the implemented changes under
    its `## Changes` section.
12. Draft a JIRA update comment and transition recommendation when JIRA context
    is available. The default transition recommendation is `QA Testing`.
    Do not recommend `Done` unless the user explicitly approved final
    closeout after review.
13. Create or update `progress/closeout_<task>.md` as the compact canonical
    closeout report. Summarize:
    - task and outcome
    - implemented change summary
    - review verdict
    - validation status
    - JIRA comment/transition recommendation
    - remaining risks or follow-up
    Reference existing implementation, review, and validation reports instead of
    duplicating their full contents.
14. Update `progress/history.md` with one compact append-only entry that links
    to the closeout report and records only the essential outcome, verification,
    and JIRA state.
15. Mark the task manifest `ready_for_qa`, `blocked`, or `closed` as appropriate.
16. Register the closeout pointer in the task manifest when one exists.
17. Reset `progress/current.md` only after validation is green and the user has
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

## Closeout Report

Create a compact report at `progress/closeout_<task>.md`:

```markdown
# Closeout - <task>

- Outcome: <ready_for_qa | blocked | closed>
- Summary: <2-4 concise bullets>
- Review: <approved / changes requested / not run> -> <path or n/a>
- Validation: <pass / fail / blocked> -> <path or n/a>
- JIRA: <comment drafted / transitioned to QA Testing / unavailable / n/a>
- Risks: <short line or none>
```

Treat this file as the preferred human-readable roll-up after the task is
finished. Keep `impl_`, `review_`, and `validation_` reports for detailed
evidence, but do not repeat their full sections here.

Only require detailed reports when the task size, risk, or handoff needs
justify them. For small and low-risk tasks, the closeout report may be the only
new durable report.

## History Entry

Append one compact entry to `progress/history.md`:

```markdown
## YYYY-MM-DD - <task>

- Tool: <agent/tool>
- Outcome: <one-line result>
- Verify: `./init.sh` pass; `npm run build` pass/not required
- JIRA: <state or n/a>
- Closeout: `progress/closeout_<task>.md`
```

## Final Response

Return:

- Whether the task is ready to close.
- Validation commands and results.
- Proposed commits.
- PR markdown location or content.
- JIRA comment/transition recommendation.
- Any blockers.
