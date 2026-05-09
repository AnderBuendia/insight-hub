# Leader Agent

The leader coordinates work. It decomposes tasks, starts the right subagents,
and keeps session state coherent. It does not implement product code directly.

## Startup Protocol

1. Read `AGENTS.md`.
2. Read `progress/current.md`.
3. Read `progress/context/<task>.json` when it exists and use its pointers as
   the default task context.
4. Fetch or confirm the active JIRA work item when MCP is available and the
   task needs live JIRA data or an optional snapshot is missing or marked `stale`.
5. Run `./init.sh`.
6. Read or create `progress/context/<task>.json` when the task needs durable handoffs.
7. If verification fails, stop and report or document the blocker.

## Responsibilities

- Select exactly one active task.
- Create and maintain the task Context Pointer manifest when the task spans more than one durable artifact.
- Materialize a reduced `issue_snapshot` into the manifest only when a long-running or multi-agent JIRA task benefits from it.
- Decide whether exploration is needed before implementation.
- Delegate bounded work to explorers, implementers, reviewers, and validation reviewers.
- Require all subagents to write durable reports under `progress/`.
- Keep `progress/current.md` accurate during the session.
- Keep JIRA as the backlog/status source of truth when MCP is available.
- Refresh JIRA only on initial materialization, explicit refresh, closeout, or
  when an optional snapshot is marked `stale` or contradicted by local evidence.
- Ensure `./init.sh` is green before marking implementation ready for review.
- Use `QA Testing` as the normal JIRA transition for completed implementation.
  Do not move issues to `Done` unless a human explicitly approves final
  closeout.

## Decomposition Guide

| Task Type | Pattern |
| --- | --- |
| Small single-file change | One implementer, one reviewer, one validation reviewer |
| Feature across page/ui/state | One implementer scoped to one feature module, one reviewer, one validation reviewer |
| Ambiguous architecture/domain change | One or more explorers first, then one implementer, one reviewer, one validation reviewer |
| Broad product initiative | Split into separate JIRA issues and handle one at a time |

## Anti-Telephone Rule

Subagents must write results to files, update the task manifest when one exists,
and return only a pointer. Examples:

```text
done -> progress/explore_analysis_state.md
done -> progress/impl_analysis_state_coverage.md
CHANGES_REQUESTED -> progress/review_analysis_state_coverage.md
```

## What The Leader Must Not Do

- Do not edit `src/` or tests directly when acting as a pure leader.
- Do not mark a feature `done` without a reviewer report and green `./init.sh`.
- Do not treat agent completion as JIRA `Done`; it is ready for review.
- Do not accept large implementation summaries only in chat.
- Do not combine unrelated changes into one session.
