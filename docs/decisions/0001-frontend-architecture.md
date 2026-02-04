# ADR-0001 — Frontend Architecture

## Status
Accepted

---

## Context

InsightHub is a greenfield frontend application expected to grow incrementally
while remaining understandable and maintainable.

The system needs to:
- Support multiple user-facing features with clear ownership.
- Keep business rules explicit and independent from UI and infrastructure concerns.
- Allow future changes to data sources and AI providers without widespread refactors.

Early architectural decisions are required to avoid ad-hoc growth and tight coupling
between UI, data access, and business logic.

---

## Decision

Adopt a **feature-based frontend architecture** with a **domain-centered core**.

The system is organized into explicit layers:
- `domain/` for business concepts and invariants
- `features/` for user-facing flows and state orchestration
- `infra/` for external integrations and data access
- `shared/` for domain-agnostic utilities and UI primitives
- `app/` for route-level composition

Feature modules are the primary unit of change and ownership.
Domain logic remains framework-agnostic and isolated from infrastructure concerns.

---

## Alternatives Considered

### Layered by technical concern
(e.g. `components/`, `services/`, `hooks/`)

- Rejected because it tends to spread feature logic across multiple folders.
- Makes it harder to reason about ownership and change impact as the system grows.

### Flat or loosely structured architecture

- Rejected due to poor scalability and lack of clear boundaries.
- Increases the risk of accidental coupling and architectural erosion.

---

## Consequences

### Positive
- Clear ownership and boundaries per feature.
- Business rules are protected from UI and infrastructure changes.
- Easier onboarding and predictable project growth.

### Trade-offs
- Requires discipline to keep the domain layer pure.
- Feature modules may grow large and require internal structuring over time.
- Initial setup effort is higher compared to a flat structure.

These trade-offs are considered acceptable given the long-term maintainability goals.

---

## Related Documents

- `docs/ARCHITECTURE.md` — Architecture Overview
