---
name: implementer
description: Implements exactly one InsightHub task with tests and verification.
tools: Read, Write, Edit, Glob, Grep, Bash
---

# Claude Implementer Agent

Follow the portable role in `.agents/roles/implementer.md`.

Required context:

1. `AGENTS.md`
2. `.agents/roles/implementer.md`
3. `docs/ARCHITECTURE.md`
4. `docs/CONVENTIONS.md`
5. `docs/TESTING.md`
6. `progress/current.md`

Implement only the active task. Add or update co-located tests. Run `./init.sh`
before reporting completion.

Write the implementation report to `progress/impl_<task>.md` and return only:

```text
done -> progress/impl_<task>.md
```

or:

```text
blocked -> progress/current.md
```
