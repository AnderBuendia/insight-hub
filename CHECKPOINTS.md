# CHECKPOINTS - Final-State Review

These checkpoints let a human or AI reviewer decide whether the repository is in
a healthy final state after an agent session.

## C1 - Harness Is Present

- [ ] `AGENTS.md` exists at the repository root.
- [ ] `init.sh` exists and exits with code 0.
- [ ] `progress/current.md` and `progress/history.md` exist.
- [ ] `docs/harness/jira-mcp.md` documents the intended JIRA MCP integration.
- [ ] `.agents/roles/leader.md`, `explorer.md`, `implementer.md`, `reviewer.md`, and `validation-reviewer.md` exist.
- [ ] Claude, Codex, and GitHub Copilot entrypoints reference the same harness.

## C2 - Task State Is Coherent

- [ ] Exactly one active work item is recorded in `progress/current.md`, or the session is idle.
- [ ] JIRA is treated as the source of truth for backlog state when available.
- [ ] Completed tasks are transitioned or commented in JIRA only after green verification.
- [ ] Blocked tasks include a concrete blocker and next step.

## C3 - Architecture Boundaries Hold

- [ ] `src/domain/` has no imports from React, Next.js, `src/infra`, `src/features`, or `src/shared`.
- [ ] `src/infra/` contains adapters and I/O, not business decisions.
- [ ] `src/features/` owns user-facing flows and state coordination.
- [ ] `src/app/` composes routes and does not implement feature logic.
- [ ] `src/shared/` remains domain-agnostic.
- [ ] Any domain model changes are reflected in `docs/domain/DOMAIN_MODEL.md`.
- [ ] Significant architecture decisions are captured in `docs/decisions/`.

## C4 - UI And Styling Conventions Hold

- [ ] Tailwind classes are kept in `/ui` directories.
- [ ] Page and state modules do not accumulate presentation markup that belongs in UI components.
- [ ] Empty, loading, error, success, and degraded states are explicit when relevant.
- [ ] Accessibility-friendly labels, roles, and interactions are covered for user-facing controls.

## C5 - Verification Is Real

- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:coverage` passes with the configured 80% thresholds.
- [ ] `npm run build` passes when the change affects routing, rendering, config, or build behavior.
- [ ] The validation reviewer report exists for substantial changes.
- [ ] Manual browser validation is documented when the change affects critical UI flows. Until the web automation tool exists, record this as not available rather than pretending it ran.
- [ ] Co-located tests cover the changed behavior, not only implementation details.
- [ ] `./init.sh` passes before the task is marked `done`.

## C6 - Session Closed Cleanly

- [ ] `progress/history.md` contains a summary of the completed session.
- [ ] `progress/current.md` is reset to its template unless another active task remains.
- [ ] No temporary files, debug logs, or unexplained TODOs remain.
- [ ] Git status contains only intentional changes.
