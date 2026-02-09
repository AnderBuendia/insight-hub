# InsightHub — Architecture (v1)

This document describes the v1 architecture for InsightHub.  
It is intentionally lightweight: enough to guide development, not to over-prescribe.

---

## 1) Purpose & Architectural Goals

### Purpose
Provide a predictable structure for building features that combine:
- Dataset exploration
- Analysis (metrics + filters)
- Optional AI assistance

### Goals (v1)
- Keep domain rules explicit and framework-agnostic.
- Make feature development predictable via a feature-based structure.
- Make system states (empty/error/degraded) first-class citizens.
- Prefer clarity over premature abstraction.

---

## 2) Key Documents

- **Domain Model (v1):** [DOMAIN_MODEL.md](../domain/DOMAIN_MODEL.md)
- **ADRs:** [Architecture Decision Records](./decisions/)

> Domain changes should be reflected in the Domain Model.
> Architecture trade-offs should be captured as ADRs.

---

## 3) System Context & Core Concepts

### Core entities (v1)
- User
- Dataset
- Metric
- Insight
- AIQuery
- Filter
- AnalysisSnapshot (optional in v1)

### Invariants (examples)
- A `Metric` is always derived from exactly one `Dataset`.
- An `Insight` must reference the dataset context it is based on.
- An `AIQuery` must always include dataset context.
- Filters always apply within a dataset context.

---

## 4) Codebase Structure & Responsibilities

### `src/domain/`
**Purpose:** Business concepts and rules.  
**Must not:** depend on UI/framework, networking, or external services.

### `src/infra/`
**Purpose:** Integrations and data access (mock data sources, AI gateway).  
**Must not:** contain business decisions; only I/O and mapping.

### `src/features/`
**Purpose:** Feature modules that orchestrate domain + infra and expose UI screens/components.  
**Owns:** user-facing flows and state coordination.

### `src/shared/`
**Purpose:** Reusable, domain-agnostic building blocks (UI primitives, generic utilities).  
**Must not:** know about datasets/metrics/insights.

### `src/app/`
**Purpose:** Route-level composition and wiring (Next.js routing).  
**Must not:** implement feature logic or business rules.

---

## 5) Feature Modules (v1)

### `features/datasets`
**Responsibilities:**
- Dataset listing and selection.
**Owns:**
- dataset list state (loading/empty/error)
- selection state
**Notes:**
- Selection should be representable via URL (shareable + reload-safe).

### `features/analysis`
**Responsibilities:**
- Present metrics and filters derived from a dataset.
**Owns:**
- filter state
- metric view state
- derived computations needed by UI
**Notes:**
- Reads dataset context from URL (v1).
- May later support saved views (`AnalysisSnapshot`).

### `features/ai`
**Responsibilities:**
- Accept natural language questions and return AI-assisted responses.
**Owns:**
- AI query state (idle/loading/success/error)
- degraded mode handling
**Notes:**
- AI is optional in v1; the product remains useful without it.

---

## 6) Data Flow (v1)

### Dataset exploration flow
1. UI triggers dataset listing load.
2. `infra` returns datasets (mock in v1).
3. `features/datasets` maps infra data into domain shapes and updates UI state.
4. Selecting a dataset updates selection (URL + local state).

### Analysis flow
1. User navigates to analysis with dataset context in URL.
2. `features/analysis` loads or derives relevant metrics/filters for that dataset (mock in v1).
3. UI presents metrics and filter placeholders (v1 skeleton).

### AI query flow
1. User submits a question with a selected dataset context.
2. `features/ai` calls `infra` AI gateway.
3. AI gateway returns a response (or error).
4. `features/ai` renders the response; degraded mode remains usable.

---

## 7) System States (v1)

### Empty state — No datasets available
**Expected behavior:**
- Show an empty state explaining that no datasets are available.
- Provide a clear call to action (v1: "Use sample dataset" or "Reload").
**UX notes:**
- The user should still understand what the product is meant to do.

### Error state — Dataset fetch fails
**Expected behavior:**
- Show an error view with retry.
- Preserve any previously loaded dataset selection if available.
**UX notes:**
- Errors should be actionable, not generic.

### Degraded state — AI unavailable or fails
**Expected behavior:**
- The user can continue exploring datasets and metrics.
- AI panel shows a fallback message + retry.
**UX notes:**
- AI is optional in v1; core product remains useful without it.

---

## 8) Decisions & Trade-offs

- AI is treated as an optional capability (degraded mode supported).
- Mock data enables fast iteration; infra will be replaceable later.
- Feature modules own UI coordination; domain stays pure.
- URL-driven dataset context improves shareability and reload safety.

For decisions that impact architecture boundaries or major tool choices, add an ADR.
