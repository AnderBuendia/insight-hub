---
name: finish-task
description: "Finish one InsightHub Harness Engineering task after implementation is ready to close: validate with the repository harness, inspect evidence and diffs, check reports, propose Conventional Commits, generate PR markdown from the repository template, draft JIRA updates, recommend QA Testing transition, update progress history, and reset session state. Use when the user asks to finish, close, wrap up, prepare review, prepare commit/PR, draft JIRA closeout, or complete final harness task closeout for a JIRA key or local task label."
---

# Finish Task

Close one InsightHub implementation task following the repository harness. Treat
the user's argument as the JIRA key or short local task label when provided.
Use English for generated repository artifacts.

## Model Routing

Default to a mini-class model when evidence already exists (green `./init.sh`,
existing reports in `progress/`). Escalate to a stronger model when:

- Validation is red or reports are missing.
- The diff is large or ambiguous enough to require product judgment.
- JIRA status or transition policy is unclear.

See `docs/harness/model-routing.md`.

## Required Inputs

| Input | Source |
| --- | --- |
| Task identifier | `$ARGUMENTS` or `progress/current.md` |
| Repository harness | `AGENTS.md` |
| Session state | `progress/current.md` |
| Task context manifest | `progress/context/<task>.json` (when present) |
| Implementation report | `progress/impl_<task>.md` (when present) |
| Code review report | `progress/review_<task>.md` (when present) |
| Validation report | `progress/validation_<task>.md` (when present) |
| Closeout report | `progress/closeout_<task>.md` (when present) |
| PR template | `.github/pull_request_template.md` |
| JIRA context | Manifest pointers first, optional snapshot second, JIRA MCP only when refresh is required |

## Procedure

### 1. Read Context

Read `AGENTS.md`, `CHECKPOINTS.md`, `progress/current.md`, and the task manifest when present.

### 2. Identify the Active Task

- Prefer the JIRA issue key from `$ARGUMENTS` or `progress/current.md`.
- Use manifest pointers as the default local context.
- If the manifest has `issue_snapshot`, use it as an optional task brief.
- If JIRA MCP is available and the snapshot is missing, marked `stale`, or
  closeout requires live data, fetch the issue: title, description, acceptance criteria, status, links.
- If JIRA MCP is unavailable, state that JIRA context is unavailable and proceed with local context.

### 3. Inspect the Diff

Run `git diff --stat` and `git diff` to understand the actual changes.
Confirm no unrelated changes are mixed into the task.

### 4. Read Progress Reports

Load the reports referenced by the task manifest when present. Otherwise load
the existing reports in `progress/` for the task:
`impl_<task>.md`, `review_<task>.md`, `validation_<task>.md`.

### 5. Run Validation

```bash
./init.sh
```

If the change touches routing, rendering, Next.js config, environment behavior,
or production-only behavior, also run:

```bash
npm run build
```

### 6. Check Validation Report

- If `progress/validation_<task>.md` is missing for a substantial code or UI change,
  create it or request it from the `validation-reviewer` subagent.
- Until browser automation exists, record browser/manual validation as
  `not available`, not as pass.

### 7. Propose Commits

Propose atomic commits using Conventional Commits.

Examples:
```text
feat(harness): add validation reviewer role
docs(harness): document jira mcp integration
test(analysis): cover url filter parsing
```

Do not create commits without user approval unless the user explicitly asked you to finish and commit.

### 8. Generate PR Markdown

Fill `.github/pull_request_template.md` with concrete task details.
Use the exact section structure from the template. Document implemented changes
under `## Changes` using bullets aligned to the inspected `git diff`.

Reference the current template instead of memorizing it. It normally includes:

- `## Summary`: what the PR does and why.
- `## Context`: what problem it addresses.
- `## Changes`: concrete bullets from the diff.
- `## Decisions`: trade-offs and technical choices.
- `## Impact`: UI / Domain / Data flow / Performance.
- `## Risks / Considerations`: edge cases and follow-up work.
- `## Checklist`

### 9. Draft JIRA Update

When JIRA MCP is available, prepare a concise comment:

```markdown
Implementation ready for review.

Summary:
- <bullet per change>

Validation:
- `./init.sh`: pass / fail
- `npm run build`: pass / not required
- Browser validation: not available until automation is added

PR:
- <link when available>
```

Default transition recommendation: **QA Testing**.
Do not transition or recommend `Done` unless the user explicitly approved
post-review closeout.

### 10. Write Compact Closeout

Create or update `progress/closeout_<task>.md` as the compact canonical
roll-up. Keep it short and reference the detailed reports instead of repeating
them.

Use this structure:

```markdown
# Closeout - <task>

- Outcome: <ready_for_qa | blocked | closed>
- Summary: <2-4 concise bullets>
- Review: <approved / changes requested / not run> -> <path or n/a>
- Validation: <pass / fail / blocked> -> <path or n/a>
- JIRA: <comment drafted / transitioned to QA Testing / unavailable / n/a>
- Risks: <short line or none>
```

Use detailed reports only when justified:

- `impl_<task>.md` for non-trivial implementation evidence
- `review_<task>.md` for explicit review findings or verdicts
- `validation_<task>.md` for validation detail beyond a one-line summary

For small, low-risk, one-session tasks, `closeout_<task>.md` may be the only
new durable report.

### 11. Update Progress Files

Append one compact entry to `progress/history.md`:

```markdown
## YYYY-MM-DD - <task>

- Tool: <agent/tool>
- Outcome: <one-line result>
- Verify: `./init.sh` pass; `npm run build` pass/not required
- JIRA: <state or n/a>
- Closeout: `progress/closeout_<task>.md`
```

Reset `progress/current.md` to the empty template **only after**:
- Validation is green.
- The user has accepted the closure path.

## Decision Points

| Condition | Action |
| --- | --- |
| `./init.sh` red | Stop. Fix environment before closing. |
| Validation report missing | Create or request `progress/validation_<task>.md`. |
| Unrelated changes in diff | Flag to user before proposing commits. |
| JIRA MCP unavailable | State it explicitly; proceed with local artifacts. |
| User asks for `Done` transition | Only if user explicitly approved post-review closeout. |

## Final Response

Return:

- Whether the task is ready to close.
- Validation commands and results.
- Proposed commits.
- PR markdown location or content.
- JIRA comment and transition recommendation.
- Closeout report path.
- Any blockers.

## Completion Criteria

- [ ] `./init.sh` passes.
- [ ] `npm run build` passes (if required).
- [ ] No unrelated changes mixed in.
- [ ] Commits proposed (not applied without approval).
- [ ] PR markdown generated from actual diff.
- [ ] JIRA comment and transition recommendation drafted.
- [ ] `progress/closeout_<task>.md` updated.
- [ ] `progress/history.md` updated.
- [ ] `progress/current.md` reset (after user acceptance).
