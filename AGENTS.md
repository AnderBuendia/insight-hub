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
4. If `progress/context/<task>.json` exists, read it before re-fetching JIRA:
   - Treat `active_pointers` and `pointers` as the default manifest contract.
   - Use `issue_snapshot` only when the manifest includes it and the task benefits from a persisted JIRA brief.
   - Re-fetch JIRA only on initial materialization, explicit refresh, closeout, or when an optional snapshot is marked `stale`.
5. Work on exactly one task at a time:
   - If the user gave an explicit task, use that task.
   - If no task is clear and JIRA MCP is unavailable, stop and ask for a work item.
6. Record the JIRA key or local task label, start time, agent/tool, and short
   plan in `progress/current.md`.

If `./init.sh` fails, fix or document the environment problem before touching
product code.

---

## 2. Repository Map

| Path | Purpose | Read When |
| --- | --- | --- |
| `progress/current.md` | Live session state | Always at startup and while working |
| `progress/context/` | Task-scoped Context Pointer manifests | When a task is active or handoffs span multiple reports |
| `progress/history.md` | Append-only session history | Before closing or when context is needed |
| `docs/harness/context-pointers.md` | Lightweight machine-friendly context indexing | Before introducing or updating task manifests |
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
- `progress/context/<task>.json` when it exists
- The user-provided task and the manifest pointers when present
- The specific files you will edit or review

Read conditionally:

- `docs/ARCHITECTURE.md` before product implementation or layer-boundary changes
- `docs/CONVENTIONS.md` before code, UI, lint, or naming changes
- `docs/TESTING.md` before adding or changing tests
- `docs/DEFINITION_OF_DONE.md` and `CHECKPOINTS.md` during closeout
- Domain docs only for domain model, business rule, or invariant changes
- Role definitions only when actually orchestrating subagents

Prefer targeted `rg` and small file ranges over whole-document reads. Prefer
task manifests over directory scans. Summarize large findings in `progress/`
instead of repeatedly re-reading the same context.
Treat `issue_snapshot` as an optional cache for long-running or multi-agent JIRA
tasks, not as the default manifest shape.

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
- When a task manifest exists, keep it aligned with the latest canonical report pointers.
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
1. Identify the assigned or requested JIRA issue key.
2. If a task manifest already exists, use its pointers as the default local context.
3. If the manifest also contains `issue_snapshot`, use it as an optional working brief.
4. If no suitable local JIRA brief exists and the task will benefit from one,
   use the configured JIRA MCP to fetch the issue, normalize a minimal snapshot,
   and materialize it into `progress/context/<task>.json`.
5. Confirm the task is small enough for one session.
6. Update progress/current.md with the JIRA key, summary, plan, and start time.
7. Keep the manifest aligned with current report pointers and optional snapshot state.
8. Reflect progress back to JIRA when the MCP is available and the action is safe.
```

User-directed mode:

```text
1. Treat the user's request as the active task.
2. If the user gives a JIRA key, fetch context through the JIRA MCP when available.
3. If a task manifest already exists for that work, prefer its pointers over a new JIRA read.
4. Omit `issue_snapshot` by default for local, short, or one-session tasks.
5. If JIRA MCP is not available, record the request directly in progress/current.md.
6. Keep the same one-task-at-a-time lifecycle.
7. Create a task manifest only if the work will span multiple durable artifacts.
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

Anti-telephone rule: subagents write their findings to files in `progress/`,
register or update the matching Context Pointer when a task manifest exists, and
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
5. When closeout work is performed, create or update one compact
   `progress/closeout_<task>.md` that summarizes implementation, review,
   validation, and JIRA closeout state.
6. Mark the task manifest `closed` or `blocked` when one exists.
7. Reset `progress/current.md` to the empty template.
8. Leave no debug logs, temporary files, or unexplained TODOs.

If final verification is red, do not close the task as done.

## 9. Report Policy

Use two report layers:

- Detailed evidence reports: `impl_<task>.md`, `review_<task>.md`,
  `validation_<task>.md`
- Compact closeout report: `closeout_<task>.md`

Default rule:

- `closeout_<task>.md` is the preferred human-facing summary at task close.
- `history.md` stores only a compact pointer-style entry at task close.

Use `closeout_<task>.md` only when all of these are true:

- The task is local, short, or one-session.
- The diff is small and low-risk.
- `./init.sh` is the only meaningful verification, or verification is simple.
- The task does not need a separate reviewer or validation artifact for safety.

Add detailed reports when any of these are true:

- The task spans multiple files or subsystems.
- The task has non-trivial design or trade-off decisions.
- The task needs explicit reviewer findings.
- The task needs explicit validation evidence beyond a one-line closeout summary.
- The task touches risky behavior, architecture, domain rules, routing, data
  flow, or external side effects.
- The task is expected to be handed off between agents or revisited later.

Practical defaults:

- Small docs or harness wording change:
  - `closeout_<task>.md` only
- Small code change with straightforward verification:
  - `impl_<task>.md` and `closeout_<task>.md`
- Medium or risky change:
  - `impl_<task>.md`, `review_<task>.md`, `validation_<task>.md`, and `closeout_<task>.md`

Legacy reports already present under `progress/` should be kept as historical
evidence. Do not delete or rewrite them unless the user explicitly asks for a
historical cleanup.
