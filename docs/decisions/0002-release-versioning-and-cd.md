# ADR-0002 — Release Versioning & Continuous Deployment Strategy

## Status
Proposed

## Date
2026-02-11

## Context
Current branch strategy:

- `main` as the stable branch.
- A long-lived release candidate branch (example: `v0.1.0-rc`).
- Sprint feature branches created from `*-rc`.
- At sprint end, branches are merged into `main` and version is bumped.

Current CI runs quality gates on Pull Requests and on pushes to `main` and `*-rc` branches, but there is no explicit deployment promotion model (preview → staging → production) documented in workflows.

This model works for small teams, but it can create friction as the team grows:

- Drift between `main` and `*-rc` can increase merge complexity.
- Urgent fixes may need to be duplicated across branches.
- Versioning and release semantics are managed manually.
- Deployment confidence depends on branch conventions more than automated promotion.

## Decision
Adopt **trunk-based development with short-lived release branches only when needed**, plus automated semantic versioning and progressive environment promotion.

### Branching model

- Keep `main` as the single integration trunk.
- Use short-lived feature branches from `main`.
- Optionally create `release/x.y` only during stabilization windows (days, not weeks).
- Avoid long-lived `vX.Y.Z-rc` branches for regular sprint development.

### Versioning model

- Keep SemVer for releases (`x.y.z`).
- Generate release candidates from tags instead of long-lived branches:
  - `v0.4.0-rc.1`, `v0.4.0-rc.2`, ...
- Automate version calculation from conventional commits (or PR labels) using a release bot.

### Deployment model

- PRs: deploy preview environments automatically.
- `main`: auto-deploy to staging.
- Version tags (`v*`): deploy to production.
- `*-rc.*` tags: optional deploy to pre-production/UAT.

### CI/CD guardrails

- Keep existing quality gates (lint, typecheck, build, tests, coverage).
- Add required status checks before merge to `main`.
- Add deployment workflow with explicit promotion and rollback strategy.

## Consequences

### Positive

- Lower branch divergence and fewer painful merges.
- Faster integration feedback (problems found earlier on `main`).
- Clearer release traceability through immutable tags.
- Safer deployments via environment-specific promotion.

### Negative / Trade-offs

- Requires tighter discipline on small PRs and feature flags.
- Team must align on commit/PR labeling for automated versioning.
- Initial setup effort for release automation and deployment workflows.

## Alternatives Considered

### 1) Keep current long-lived `*-rc` branch model

Pros:
- Familiar and easy to reason about for sprint planning.

Cons:
- Higher merge overhead.
- Greater risk of hidden integration issues.
- More manual release/version operations.

### 2) Full GitFlow (`develop`, `release/*`, `hotfix/*`, `main`)

Pros:
- Explicit release and hotfix lanes.

Cons:
- More operational overhead for a product in active iteration.
- Slower throughput for frequent deployments.

## Suggested adoption plan

1. Pilot for 1 release cycle using trunk + feature branches.
2. Introduce semantic release automation in dry-run mode.
3. Add staged deployment workflow (preview/staging/production).
4. Remove long-lived `*-rc` branch from the default process.
5. Keep `release/x.y` only for exceptional stabilization periods.

## Transition from current long-lived RC

### Recommended approach (for the current sprint)

Do **not** interrupt the current sprint in the middle of an active long-lived `*-rc` cycle.
Prefer this sequence:

1. Finish the sprint on the current `*-rc` branch as planned.
2. Merge the current `*-rc` into `main`.
3. Tag the sprint release (`vX.Y.Z` or `vX.Y.Z-rc.N` depending on your release policy).
4. Start the new workflow from `main` (short-lived feature branches + environment promotion).

This minimizes risk, avoids changing branch semantics mid-sprint, and keeps release accountability clear.

### Optional exception

Switch mid-sprint **only** if the current `*-rc` branch is already causing blocking issues
(severe merge conflicts, unstable release branch, or urgent delivery pressure). In that case,
freeze new feature intake for a short migration window, complete a controlled merge to `main`,
and resume work under the new model.

### Practical migration checklist

- Keep current sprint scope unchanged.
- Announce a cutover date immediately after the current RC merge.
- Protect `main` with required checks (lint, typecheck, build, tests, coverage).
- Enable preview deploys for PRs before enforcing the new flow.
- Configure release automation in dry-run for 1 cycle; then enforce.
- Archive or lock the old long-lived `*-rc` branch after successful cutover.

## Notes specific to InsightHub

Given the project status (active development, evolving architecture, and already enforced CI quality gates), this strategy should improve delivery speed and reduce branch management overhead without sacrificing safety.
