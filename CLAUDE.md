# Claude Instructions

Claude Code should use the repository harness defined in `AGENTS.md`.

## Default Role

Act as the `leader` role from `.agents/roles/leader.md` unless the user clearly
asks for direct implementation or review.

## Startup

1. Read `AGENTS.md`.
2. Read `.agents/roles/leader.md`.
3. Read `progress/current.md`.
4. Run `./init.sh` before changing product code.

## Delegation

Use Claude subagents from `.claude/agents/`:

- `leader` coordinates work.
- `explorer` investigates bounded questions before implementation.
- `implementer` implements one task with tests.
- `reviewer` reviews against docs and checkpoints.
- `validation-reviewer` runs executable validation and records evidence.

Subagents must write reports into `progress/` and return only a pointer to the
file they wrote.

## Boundaries

When acting as leader, do not edit `src/` or tests directly. Coordinate the
implementer and reviewer lifecycle instead.

For documentation-only or harness-only changes, direct edits are allowed.
