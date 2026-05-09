# Task Context Manifests

This directory stores machine-friendly task manifests for active or recent
tasks.

Each task may have one manifest:

- `progress/context/<task>.json`

The manifest indexes the human-readable reports already written under
`progress/` and may store one reduced `issue_snapshot` for the active JIRA
task. It should stay small and should not become a second knowledge base or a
full local copy of JIRA.

Use the manifest as the first task-specific read after `progress/current.md`.
Its default job is to point at canonical local artifacts. Add `issue_snapshot`
only when a long-running or multi-agent JIRA task benefits from a persisted
brief. Omit it by default for local, short, or one-session work.

Only refresh JIRA when the optional snapshot is missing, marked `stale`, or a
closeout action requires live data.

Use `task-template.json` as the starting point for a new task manifest.
