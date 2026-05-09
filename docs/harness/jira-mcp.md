# JIRA MCP Integration Plan

JIRA should become the source of truth for the Harness Engineering backlog.
This repository should not maintain a parallel local task list.

## Current Recommendation

Use Atlassian's official remote MCP server first, rather than building a custom
MCP server immediately.

Atlassian documents a remote MCP server for Jira, Confluence, and Compass at:

- `https://mcp.atlassian.com/v1/mcp`

The documented setup uses OAuth 2.1 authorization and lets MCP-capable clients
connect to Atlassian cloud data without a project-local server.

Note: Atlassian documents that the older `/sse` endpoint is deprecated after
2026-06-30, so new client configuration should use `/mcp`.

## Harness Behavior

When JIRA MCP is available:

1. The leader identifies the requested or assigned issue key.
2. The leader uses the manifest pointers as the default local context when a task manifest exists.
3. If the task will benefit from a persisted JIRA brief, the leader may store a
   minimal `issue_snapshot` in `progress/context/<task>.json`.
4. If no suitable local JIRA brief exists or an optional snapshot is marked `stale`,
   the leader fetches the issue once, normalizes a reduced snapshot, and stores it in the manifest.
5. Explorers and implementers write durable reports under `progress/`.
6. The validation reviewer runs verification and writes a report.
7. The finish-task prompt prepares JIRA comments/status updates and the PR.
8. Completed implementation work moves to `QA Testing`. `Done` is
   reserved for the human-approved post-review closeout.

When JIRA MCP is not available:

1. The user-provided task becomes the local work item.
2. `progress/current.md` records that JIRA context was unavailable.
3. The session can proceed if the task is clear and bounded.
4. No agent should invent issue metadata.

## Build-Vs-Buy Decision

Start with the official Atlassian remote MCP because it provides:

- Hosted connectivity.
- OAuth-based authentication.
- JIRA and Confluence coverage.
- Lower maintenance cost.

Consider a custom MCP only if the project needs behavior the official server
cannot provide, such as:

- Opinionated JQL presets.
- Project-specific issue transition policies.
- Custom field normalization.
- Automatic PR/JIRA linking conventions.
- Guardrails around who may transition or comment on issues.

Before building a custom MCP, prefer a thin local materialization layer that:

- normalizes issue payloads into a cheap local brief
- writes the brief into the task manifest
- applies one simple snapshot state across agents
- reduces repeated token-heavy JIRA reads without replacing JIRA as source of truth

This local materialization layer should remain optional. The base harness flow
should still work with pointers only.

## Possible Custom MCP Shape

If a custom MCP becomes necessary, keep it thin:

- Transport: stdio for local clients first; remote HTTP only if needed.
- Auth: environment-provided Atlassian API token or OAuth app credentials.
- Tools:
  - `jira_get_issue(issueKey)`
  - `jira_search_issues(jql, limit)`
  - `jira_add_comment(issueKey, body)`
  - `jira_transition_issue(issueKey, transitionName)`
  - `jira_get_current_user()`
- Resources:
  - `jira://issue/{issueKey}`
  - `jira://project/{projectKey}/active-sprint`
- Safety:
  - Reads are allowed by default.
  - Writes require explicit confirmation or a client-side approval rule.
  - The default completion transition is `QA Testing`.
  - `Done` requires explicit human approval in the current session.
  - Transitions must be reported in `progress/history.md`.

## Status Mapping

| Harness state | JIRA status | Notes |
| --- | --- | --- |
| Active implementation | In progress / equivalent project status | Use the actual project workflow name exposed by JIRA. |
| Green implementation ready for review | QA Testing | Default transition after verification and PR/comment preparation. |
| Blocked | Blocked / comment only | If no blocked status exists, leave status unchanged and comment the blocker. |
| Human-approved final closeout | Done | Agents must not use this as the normal implementation closeout. |

## Open Questions

- Which Atlassian site and project key should InsightHub use?
- Which issue fields contain acceptance criteria?
- Should agents be allowed to comment automatically, or only propose comments?
- Should issue transitions require human approval?
