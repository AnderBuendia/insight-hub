# Current Session

> This file is live session state. Keep it updated while working, not only at
> the end. Reset it to this template when the session closes.

- **Active task:** `harness-jira-hybrid-context`
- **Start:** `2026-05-06 11:05 Europe/Madrid`
- **Agent/tool:** `Codex GPT-5`
- **Context manifest:** `progress/context/harness-jira-hybrid-context.json`
- **Status:** `in_progress`

## Plan

1. Update the harness docs to define the hybrid local JIRA snapshot workflow.
2. Simplify the task manifest template so the base case is pointers-only.
3. Align portable and tool-specific instructions so agents only use `issue_snapshot` when it exists and the case justifies it.
4. Define the report policy: when a task needs only `closeout` versus detailed `impl/review/validation` evidence.
5. Verify with targeted tests and `./init.sh`.

## Log

- Reviewed `AGENTS.md`, harness docs, role files, prompts, and context manifest examples.
- Decided to keep JIRA as the source of truth while caching a minimal `issue_snapshot` in `progress/context/<task>.json`.
- Planned a small helper script to normalize JIRA issue payloads into a stable local brief.
- Confirmed the final policy: `context_pointers` are the base, `issue_snapshot` is optional and omitted by default for local or short tasks.
- Decided to define `closeout_<task>.md` as the compact human-facing summary and keep detailed reports only when the task size or risk justifies them.
- Ran `./init.sh` successfully after the harness updates; lint, typecheck, and coverage passed.
- Created `impl`, `review`, `validation`, and `closeout` reports for `harness-jira-hybrid-context`.
- Updated the task manifest to `ready_for_qa` and registered the canonical closeout pointer.

...

## Next Step

Share the closeout package with the user, including proposed commits, PR text, and the note that JIRA was unavailable in-session.
