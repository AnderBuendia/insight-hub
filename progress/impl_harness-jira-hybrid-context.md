# Implementation Report - harness-jira-hybrid-context

## Task

Define the hybrid local JIRA context workflow for the harness so agents prefer
task manifests and Context Pointers, only persist `issue_snapshot` when a task
benefits from it, and use a compact closeout-first reporting policy.

## Files Changed

- `AGENTS.md` - added required startup/closeout rules for task manifests,
  optional snapshots, and closeout reporting.
- `docs/harness/context-pointers.md` - documented the Context Pointer model,
  manifest lifecycle, pointer types, and stale-state rules.
- `progress/context/task-template.json` - reduced the default manifest to a
  pointers-only baseline.
- `progress/context/harness-jira-hybrid-context.json` - materialized the task
  manifest for this harness task.
- `docs/harness/jira-mcp.md` - documented the optional local JIRA
  materialization layer and snapshot refresh policy.
- `.agents/roles/*.md`, `.codex/README.md`,
  `.github/copilot-instructions.md`, `.github/instructions/harness.instructions.md`,
  `.github/prompt/route-task.prompt.md`, `.github/prompt/finish-task.prompt.md` -
  aligned agent startup and closeout workflows around manifest-first context.
- `progress/history.md` and `CHECKPOINTS.md` - added compact closeout/history
  expectations and manifest coherence checks.
- `scripts/jira-materialize-context.js` and
  `scripts/jira-materialize-context.test.js` - added a small helper to normalize
  a reduced `issue_snapshot` into a manifest when needed.
- `vitest.config.ts` - excluded `scripts/**` from app coverage accounting.
- `.github/skills/finish-task/*` and `.codex/config.toml` - added the finish-task
  skill and enabled multi-agent support for Codex.

## Design Notes

- Context manifests are now the machine-friendly index; `progress/current.md`
  remains the live dashboard.
- `issue_snapshot` is explicitly optional and treated as an operational cache,
  not as a second source of truth.
- Closeout now prefers one compact `closeout_<task>.md` report, with detailed
  `impl/review/validation` artifacts only when task size or risk justifies them.
- The local JIRA materialization helper keeps snapshot shape small and stable so
  agents do not re-fetch heavyweight issue payloads by default.

## Verification

- `./init.sh`: pass.
- `npm run build`: not required for this harness/documentation/script change.
- `scripts/jira-materialize-context.test.js`: covered through `./init.sh`
  (`npm run test:coverage`).

## Risks / Follow-up

- JIRA MCP was not available in this session, so live issue refresh and
  transition behavior remain documented rather than exercised end to end.
