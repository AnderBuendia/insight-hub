# Model Routing

The harness should route each task to the least expensive model class that can
complete it safely. This is an execution policy, not a quality shortcut: mini
models are for bounded, evidence-driven work; stronger models are for judgment,
ambiguity, and risk.

## Routing Decision

Before starting a non-trivial task, classify it into one of these lanes.

| Lane | Use for | Default model class |
| --- | --- | --- |
| Deterministic closeout | Commit proposals, PR markdown, JIRA comments, session history, release notes from verified evidence | Mini |
| Mechanical docs | Formatting, link updates, status wording, checklist alignment, simple prompt edits | Mini |
| Simple code maintenance | Narrow rename, small copy change, low-risk test expectation update with clear failure | Mini, then verify |
| Product implementation | Feature behavior, state changes, domain rules, data flow, UI workflows | Stronger |
| Review and debugging | Complex review, failing validation, flaky tests, architectural trade-offs | Stronger |
| External side effects | JIRA transitions, publishing, releases, destructive git operations | Stronger or human-approved tool flow |

## Mini Preconditions

Use a mini-class model only when all of these are true:

- The task is small and bounded.
- The expected output shape is known.
- Required evidence already exists or can be fetched with targeted reads.
- The work does not require product, architecture, security, or data-integrity
  judgment.
- Verification can be run after the work.

## Escalation Triggers

Escalate to a stronger model when any of these appear:

- The user request is ambiguous or combines unrelated tasks.
- JIRA, progress reports, git diff, or validation evidence conflict.
- Tests, lint, typecheck, build, or coverage are red.
- The task touches domain rules, data contracts, auth, persistence, payments,
  security, privacy, migrations, or production configuration.
- The change spans multiple feature areas or requires architectural trade-offs.
- A mini model reports uncertainty or produces output that does not match the
  repository evidence.
- The next action has irreversible external side effects.

## Automation Contract

When the execution environment supports explicit model selection, the leader or
runner should:

1. Classify the task using the routing decision table.
2. Start mini-eligible work with a mini-class model.
3. Pass only the active task, relevant file paths, and required evidence.
4. Require the mini run to return structured output and any escalation reason.
5. Re-run or continue with a stronger model if an escalation trigger appears.
6. Record the chosen lane and verification result in `progress/current.md` or
   `progress/history.md`.

When model selection is not available inside the current session, still apply
the same classification and record which lane would have been used.

## Recommended Mini Tasks

- `.github/prompt/finish-task.prompt.md`
- PR description generation from an inspected diff
- Conventional Commit proposal generation
- JIRA update comment drafts
- Session history summaries
- Simple markdown cleanup
- Checklist synchronization
- Search-and-report tasks with a narrow target

## Stronger-Model Tasks

- New feature implementation
- Test strategy design
- Complex bug investigation
- Code review of risky diffs
- Domain model or architecture changes
- Any task where the correct answer is not directly derivable from existing
  repository evidence
