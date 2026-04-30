# Codex Harness Notes

Codex should treat the root `AGENTS.md` as the source of truth for repository
behavior.

## Default Flow

1. Run `./init.sh` before product-code changes.
2. Read `progress/current.md`.
3. Work on exactly one task.
4. Keep `progress/current.md` updated.
5. Use the portable roles in `.agents/roles/` when delegating or reviewing.
6. Run `./init.sh` before marking a task done.

## Role Mapping

- Planning and coordination: `.agents/roles/leader.md`
- Investigation: `.agents/roles/explorer.md`
- Implementation: `.agents/roles/implementer.md`
- Code review: `.agents/roles/reviewer.md`
- Executable validation review: `.agents/roles/validation-reviewer.md`

When using Codex subagents, ask them to write reports under `progress/` and
return only a pointer to the report.
