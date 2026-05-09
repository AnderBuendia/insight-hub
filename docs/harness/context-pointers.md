# Context Pointers

Context Pointers are a lightweight indexing layer for the existing harness.
They do not replace `progress/current.md` or the task reports under
`progress/`; they make those artifacts easier for humans and agents to find,
trust, and reuse without re-reading the whole session.

## Goals

- Keep context loading small and explicit.
- Reuse the existing durable reports in `progress/`.
- Make the latest task context discoverable without directory scanning.
- Mark stale reports after new implementation work lands.

## Design

Each active task may have one manifest:

- `progress/context/<task>.json`

The manifest stores typed pointers to the task's human-readable artifacts.
That pointer layer is the primary purpose of the manifest. It may also store one
reduced JIRA snapshot when a long-running or multi-agent task benefits from a
persisted brief.

## Minimal Pointer Types

- `task_brief`
- `exploration`
- `implementation`
- `review`
- `validation`
- `closeout`
- `decision`

Start with these. Add more types only when a repeated need appears.

## Manifest Shape

```json
{
  "task_id": "IHSQD-61",
  "status": "context_ready",
  "active_pointers": {
    "task_brief": "task_brief_v1",
    "implementation": "impl_v2"
  },
  "pointers": [
    {
      "id": "task_brief_v1",
      "type": "task_brief",
      "path": "progress/current.md",
      "state": "current",
      "updated_at": "2026-05-05T10:00:00Z"
    },
    {
      "id": "impl_v2",
      "type": "implementation",
      "path": "progress/impl_ihsqd-61.md",
      "state": "current",
      "updated_at": "2026-05-05T11:10:00Z",
      "depends_on": ["task_brief_v1"]
    }
  ]
}
```

## Optional Snapshot Extension

Use `issue_snapshot` only when the task will benefit from persisting a minimal
JIRA brief between handoffs or pauses.

```json
{
  "issue_snapshot": {
    "task_id": "IHSQD-61",
    "summary": "Add context pointers for harness tasks",
    "status": "In Progress",
    "acceptance_criteria": [
      "Context manifests exist for durable task handoffs",
      "Agents prefer the manifest over scanning progress reports"
    ],
    "last_jira_sync_at": "2026-05-05T10:00:00Z",
    "snapshot_state": "fresh"
  }
}
```

## Snapshot Rules

- Keep `issue_snapshot` intentionally small and stable.
- Omit it by default for local tasks, short tasks, and one-session work.
- Include only fields that materially affect implementation or review:
  - `task_id`
  - `summary`
  - `status`
  - `acceptance_criteria`
  - `last_jira_sync_at`
  - `snapshot_state`
- Add `priority`, `links`, or `blockers` only when a specific task actually needs them.
- Exclude long descriptions, full comment threads, changelog history, and
  custom fields that agents do not actively use.
- Treat the snapshot as an operational cache, not as a second source of truth.

## Status Values

Use a short lifecycle:

- `task_selected`
- `context_ready`
- `implementation_done`
- `verified`
- `ready_for_qa`
- `blocked`
- `closed`

## Snapshot State

- A snapshot becomes stale when:
  - the user explicitly requests a refresh
  - local evidence conflicts with JIRA-backed context
  - the team decides its age is no longer trustworthy
- Store this as:
  - `snapshot_state: "fresh" | "stale"`
  - optional `refresh_reason` only when the reason matters
- A new implementation pointer marks older implementation, review, and
  validation pointers as `stale`.
- A new task brief may mark all derived pointers as `stale` when the task
  meaning changed.
- Closeout pointers do not invalidate implementation pointers.

## Agent Usage

- Leaders create the manifest when the task starts and keep its pointers current.
- Leaders materialize `issue_snapshot` only when the task justifies a persisted
  JIRA brief.
- Explorers, implementers, reviewers, and validation reviewers write their
  normal `progress/*.md` reports, then register them in the manifest.
- Agents should prefer the manifest over scanning `progress/` when one exists.
- Agents should read `issue_snapshot` only when the manifest includes it.
- Agents should only return to JIRA for initial materialization, explicit
  refresh, closeout, or unresolved conflicts.
- Chat handoffs may still return a file path, but the durable state lives in the
  manifest plus the report file.

## Human Workflow

- `progress/current.md` remains the live dashboard.
- The context manifest is the machine-friendly index for reports and pointers.
- `issue_snapshot`, when present, is only a small optional cache.
- Reports remain the durable human-readable evidence.
- `closeout` pointers may reference one compact roll-up report that summarizes
  implementation, review, validation, and final task state.

## Report Layers

Use reports in two layers:

- Detailed evidence:
  - `implementation`
  - `review`
  - `validation`
- Compact roll-up:
  - `closeout`

Recommended default:

- Always prefer one `closeout` pointer at task close.
- Add detailed pointers only when the task size, risk, or handoff needs justify
  them.

Decision rule:

- Use only `closeout` for small, local, low-risk tasks with simple verification.
- Add `implementation` when the task needs durable build notes, changed-file
  context, or non-trivial design rationale.
- Add `review` when an explicit review verdict or findings record matters.
- Add `validation` when executable validation needs more than one summary line.

Older detailed reports remain valid evidence even if newer tasks use a more
compact closeout-first pattern.

## What This Replaces

This removes the need to repeatedly:

- scan `progress/` to guess the latest report
- infer whether a report is stale
- read all reports when only one pointer type is needed
- re-fetch JIRA for routine task context that has already been normalized locally

## What This Does Not Replace

- JIRA as backlog source of truth
- `progress/current.md` as the live session state
- `progress/history.md` as the append-only session log
- `./init.sh` as the verification gate
