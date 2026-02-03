# InsightHub — Architecture Overview

## 1) Architectural Goals (v1)
- Keep domain rules explicit and framework-agnostic.
- Make feature development predictable via a feature-based structure.
- Make system states (empty/error/degraded) first-class citizens.
- Prefer clarity over premature abstraction.

## 2) Layering & Responsibilities

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

## 3) Feature Modules (v1)

### `features/datasets`
**Responsibilities:**
- Provide dataset selection and dataset listing.
**Owns:**
- dataset list state (loading/empty/error)
- selection state

### `features/analysis`
**Responsibilities:**
- Present metrics and filters derived from a dataset.
**Owns:**
- filter state
- metric view state
- derived computations needed by UI

### `features/ai`
**Responsibilities:**
- Accept natural language questions and return AI-assisted responses.
**Owns:**
- AI query state (idle/loading/success/error)
- degraded mode handling

## 4) Domain Layer

### Domain models (initial)
- User
- Dataset
- Metric
- Insight
- AIQuery

### Invariants (examples)
- A `Metric` is always derived from exactly one `Dataset`.
- An `Insight` must reference the metrics or dataset context it is based on.
- An `AIQuery` must always include dataset context (explicit or implicit).

## 5) Data Flow

### Dataset exploration flow
1. UI triggers dataset listing load.
2. `infra` returns datasets (mock in v1).
3. `features/datasets` maps data into domain-friendly shapes and updates UI state.
4. Selecting a dataset triggers metric/analysis loading for that dataset.

### AI query flow
1. User submits a question with a selected dataset context.
2. `features/ai` calls `infra` AI gateway.
3. AI gateway returns a response (or error).
4. `features/ai` renders the response and stores minimal history (optional for v1).

## 6) System States (v1)

### Empty state — No datasets available
**Expected behavior:**
- The app shows an empty state explaining that no datasets are available.
- Provide a clear call to action (for v1: "Use sample dataset" or "Reload").
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
- AI is optional in v1; the core product remains useful without it.

## 7) Decisions & Trade-offs
- AI is treated as an optional capability (degraded mode supported).
- Mock data enables fast iteration; infra will be replaceable later.
- Feature modules own UI coordination; domain stays pure.
