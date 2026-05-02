# AGENTS.md — Navigation Map for AI Agents

This repository is designed to be worked on by autonomous AI agents with a
small, explicit harness. This file is the entry point. It is a map, not a rule
dump: read the linked documents only when they are relevant to the task.

---

## 1. Required Startup

Before changing code:

1. Run `./init.sh` and confirm it exits successfully.
2. Read `progress/current.md` to understand whether a session is already active.
3. Identify the active work item:
   - Prefer the JIRA issue provided by the user or fetched through the JIRA MCP.
   - If JIRA is not connected yet, use the user's explicit request as the work item.
4. Work on exactly one task at a time:
   - If the user gave an explicit task, use that task.
   - If no task is clear and JIRA MCP is unavailable, stop and ask for a work item.
5. Record the JIRA key or local task label, start time, agent/tool, and short
   plan in `progress/current.md`.

If `./init.sh` fails, fix or document the environment problem before touching
product code.

---

## 2. Repository Map

| Path | Purpose | Read When |
| --- | --- | --- |
| `progress/current.md` | Live session state | Always at startup and while working |
| `progress/history.md` | Append-only session history | Before closing or when context is needed |
| `docs/harness/jira-mcp.md` | JIRA MCP research and integration plan | When selecting or updating work items |
| `docs/harness/model-routing.md` | Mini vs stronger model routing policy | Before delegating or choosing model class |
| `docs/ARCHITECTURE.md` | Product architecture and layer responsibilities | Before implementation |
| `docs/CONVENTIONS.md` | Naming, styling, lint, branching conventions | Before editing code |
| `docs/TESTING.md` | Test structure and coverage expectations | Before writing tests |
| `docs/DEFINITION_OF_DONE.md` | Human-facing completion criteria | Before marking done |
| `docs/DOMAIN.md` and `docs/domain/` | Domain model and invariants | For domain changes |
| `docs/decisions/` | Architecture Decision Records | For non-trivial trade-offs |
| `CHECKPOINTS.md` | Objective final-state review checklist | Before closing |
| `.agents/roles/` | Portable role definitions | When orchestrating subagents |
| `.claude/agents/` | Claude-specific role wrappers | Claude Code only |
| `.codex/` | Codex-specific harness notes | Codex only |
| `.github/instructions/` | GitHub Copilot area-specific instructions | Copilot only |

---

## 3. Context Budget

Keep startup small. Read the always-required files first, then load other
documents only when the active task touches their area.

Always read:

- `progress/current.md`
- The user-provided task or JIRA issue context
- The specific files you will edit or review

Read conditionally:

- `docs/ARCHITECTURE.md` before product implementation or layer-boundary changes
- `docs/CONVENTIONS.md` before code, UI, lint, or naming changes
- `docs/TESTING.md` before adding or changing tests
- `docs/DEFINITION_OF_DONE.md` and `CHECKPOINTS.md` during closeout
- Domain docs only for domain model, business rule, or invariant changes
- Role definitions only when actually orchestrating subagents

Prefer targeted `rg` and small file ranges over whole-document reads. Summarize
large findings in `progress/` instead of repeatedly re-reading the same context.

## 4. Model Routing

Before delegating or choosing a model class, classify the task with
`docs/harness/model-routing.md`.

Default to mini-class models for deterministic, evidence-driven work such as
commit proposals, PR markdown, JIRA comments, session-history entries,
mechanical docs updates, checklist synchronization, and narrow search/report
tasks.

Use `.github/prompt/route-task.prompt.md` when a runner needs an explicit
pre-flight decision before launching a prompt, subagent, or model-specific
session.

Use a stronger model for ambiguous product behavior, architecture, domain or
test strategy, failing validation, complex review/debugging, security or
data-integrity risk, and irreversible external side effects.

If model selection is unavailable inside the current session, apply the same
classification and record which lane would have been used.

---

## 5. Hard Rules

- One task at a time. Do not mix unrelated features, fixes, or refactors.
- Do not mark a task `done` without green verification.
- A completed implementation is ready for human review, not production-final.
  When JIRA is available, move it to `QA Testing`, not `Done`, unless a
  human explicitly asks for the final transition.
- Keep `progress/current.md` updated while working, not only at the end.
- JIRA is the intended source of truth for backlog and task state. Do not
  maintain a parallel local task list in this repository.
- Respect layer boundaries:
  - `src/domain/` is framework-agnostic business logic.
  - `src/infra/` is adapters and external integration.
  - `src/features/` owns feature orchestration and user-facing flows.
  - `src/app/` is Next.js route composition.
  - `src/shared/` is reusable and domain-agnostic.
- Tailwind classes belong in `/ui` directories, per `docs/CONVENTIONS.md`.
- Tests are co-located with source files and must preserve coverage thresholds.
- If a tool behaves unexpectedly, document the blocker instead of inventing an
  unverified workaround.

---

## 6. How to Choose Work

JIRA-connected mode:

```text
1. Use the configured JIRA MCP to fetch the assigned or requested issue.
2. Read the issue title, description, acceptance criteria, labels, and links.
3. Confirm the issue is small enough for one session.
4. Update progress/current.md with the JIRA key, summary, plan, and start time.
5. Reflect progress back to JIRA when the MCP is available and the action is safe.
```

User-directed mode:

```text
1. Treat the user's request as the active task.
2. If the user gives a JIRA key, fetch context through the JIRA MCP when available.
3. If JIRA MCP is not available, record the request directly in progress/current.md.
4. Keep the same one-task-at-a-time lifecycle.
```

---

## 7. Multi-Agent Pattern

Use the portable role definitions in `.agents/roles/`:

- `leader.md` — decomposes and coordinates, does not implement product code.
- `explorer.md` — investigates bounded questions before implementation.
- `implementer.md` — implements exactly one task with tests and verification.
- `reviewer.md` — reviews code changes against docs and checkpoints, does not edit.
- `validation-reviewer.md` — runs automated validation and, later, manual web
  checks such as Puppeteer/Playwright smoke flows.

Anti-telephone rule: subagents write their findings to files in `progress/` and
return only a short pointer, such as `done -> progress/impl_<task>.md`.

---

## 8. Session Close

Before ending a session:

1. Run `./init.sh`.
2. If the implementation is complete and JIRA MCP is available, propose or
   perform the agreed JIRA comment and transition to `QA Testing`.
   Do not transition to `Done` unless a human explicitly approves it.
3. If the task is blocked, document the blocker and next step in
   `progress/current.md`; mirror it to JIRA when possible.
4. Append the session summary to `progress/history.md`.
5. Reset `progress/current.md` to the empty template.
6. Leave no debug logs, temporary files, or unexplained TODOs.

If final verification is red, do not close the task as done.
