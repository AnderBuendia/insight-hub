---
name: route-harness-task
description: "Classify one InsightHub task and choose mini vs stronger model routing before execution."
argument-hint: "JIRA key, prompt path, or short task description"
disable-model-invocation: false
---

# Route Harness Task

Use this prompt before executing a non-trivial task when the runner supports
explicit model selection or subagent delegation.

You are operating inside the InsightHub Harness Engineering workflow. Use English
for all generated repository artifacts.

## Inputs

- Task identifier or description: `$ARGUMENTS`
- Routing policy: `docs/harness/model-routing.md`
- Session state: `progress/current.md`
- Task context manifest: `progress/context/<task>.json` when present
- JIRA context: fetch through the JIRA MCP only when local pointers are not
  enough, or when an optional snapshot is missing, marked `stale`, or the task
  was not materialized yet

## Required Flow

1. Read `progress/current.md`, the task manifest when present, and `docs/harness/model-routing.md`.
2. Prefer the manifest pointers as the default task context.
3. Read `issue_snapshot` only when the manifest includes it.
4. Identify the active task from `$ARGUMENTS`, manifest pointers, the optional snapshot, JIRA, or `progress/current.md`.
5. Classify the task into one routing lane from the policy.
6. Decide the default model class:
   - `mini` for deterministic, evidence-driven work.
   - `stronger` for ambiguity, implementation judgment, red validation, risky
     review/debugging, or external side effects.
7. List the evidence that should be passed to the selected model.
8. List escalation triggers to watch for during execution, including stale snapshot conflicts.
9. Record the routing decision in `progress/current.md` if a session is active.

## Output

Return a concise routing decision:

```markdown
## Routing Decision

- Task:
- Lane:
- Model class:
- Reason:
- Evidence to pass:
- Escalation triggers:
- Progress update:
```

Do not implement the task in this prompt. It only routes the work.
