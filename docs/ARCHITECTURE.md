# InsightHub — Architecture Overview (v1)

## 1) Architectural Goals (v1)

- Keep domain rules explicit and framework-agnostic.
- Make feature development predictable via a feature-based structure.
- Make system states (loading/empty/error/degraded) first-class citizens.
- Prefer clarity and explicit boundaries over premature abstraction.

### Architectural Non-goals (v1)
- No global state management framework by default.
- No real multi-tenant or role-based authorization model.
- No real-time updates or streaming data.
- No advanced caching strategy beyond default Next.js capabilities.

---

## 2) Layering & Responsibilities

### `src/domain/`
**Purpose:** Core business concepts and rules.  
**Must not:** depend on UI, frameworks, networking, or external services.

### `src/infra/`
**Purpose:** External integrations and data access (mock repositories, AI gateway).  
**Must not:** contain business decisions; only I/O, mapping, and protocol handling.

### `src/features/`
**Purpose:** Feature modules that orchestrate domain logic and infra to deliver user-facing flows.  
**Owns:** UI state, orchestration, and interaction logic.

### `src/shared/`
**Purpose:** Reusable, domain-agnostic utilities and UI primitives.  
**Must not:** reference domain concepts such as datasets, metrics, or insights.

### `src/app/`
**Purpose:** Route-level composition and application wiring (Next.js routing).

---

## 2.1 Dependency Rules

- `domain/` must not import from any other layer.
- `infra/` may import from `domain/` for mapping purposes, but not from `features/`.
- `features/` may import from `domain/`, `infra/`, and `shared/`.
- `shared/` must not import from `domain/` or `features/`.
- `app/` may import from `features/` and `shared/`, but must not access `infra/` directly.

These rules enforce clear boundaries and prevent accidental coupling.

---

## 3) Feature Modules (v1)

### `features/datasets`
**Responsibilities:**
- List available datasets.
- Handle dataset selection.

**Owns:**
- Dataset list state (loading / empty / error).
- Selected dataset state.

**Must not:**
- Define dataset business rules.
- Fetch data directly without going through `infra/`.

---

### `features/analysis`
**Responsibilities:**
- Present metrics and filters derived from a selected dataset.

**Owns:**
- Filter state.
- Metric view state.
- UI-level derived computations.

**Must not:**
- Fetch datasets directly.
- Encode domain invariants related to metrics.

---

### `features/ai`
**Responsibilities:**
- Accept natural language queries.
- Render AI-assisted responses.

**Owns:**
- AI query lifecycle (idle / loading / success / error).
- Degraded mode handling.

**Must not:**
- Block core dataset exploration when AI is unavailable.

---

## 4) Domain Layer

### Domain Models (initial)
- User
- Dataset
- Metric
- Insight
- AIQuery

### Domain Boundaries
Domain rules are implemented as:
- Value objects and types (e.g. identifiers).
- Constructors or factories enforcing invariants.
- Pure functions for deriving metrics or insights.

### Invariants (examples)
- A `Metric` is always derived from exactly one `Dataset`.
- An `Insight` must reference the dataset or metrics it is based on.
- An `AIQuery` cannot be executed without dataset context in v1.

---

## 5) Data Flow

### Dataset exploration flow
1. UI requests dataset list.
2. `infra` returns datasets (mock data in v1).
3. `features/datasets` maps data into domain-friendly shapes and updates state.
4. Selecting a dataset triggers analysis loading.

### AI query flow
1. User submits a question with dataset context.
2. `features/ai` calls the AI gateway in `infra`.
3. Gateway returns a response or error.
4. Feature renders result or fallback.

---

## 5.1 Infra Contracts (v1)

Conceptual contracts exposed by `infra/`:

- `DatasetRepository.list() -> Dataset[]`
- `DatasetRepository.get(id) -> Dataset`
- `AnalysisService.getMetrics(datasetId) -> Metric[]`
- `AIGateway.ask(query, datasetId) -> AIResponse`

These contracts are intentionally simple to allow replacement of mock data later.

---

## 6) System States (v1)

### Loading state
- **Expected behavior:** Render skeleton UI and disable dependent actions.
- **UX notes:** Avoid layout shifts; keep previous data visible during refetch.

---

### Empty state — No datasets available
- **Expected behavior:** Show an explanatory empty state with a clear call to action (e.g. use sample data).
- **UX notes:** User should still understand the product’s purpose.

---

### Error state — Dataset fetch fails
- **Expected behavior:** Show actionable error with retry.
- **UX notes:** Preserve previous successful selection if available.

---

### Partial failure — Metrics fetch fails
- **Expected behavior:** Keep dataset selected; show metrics error with retry.
- **UX notes:** Allow switching datasets to recover.

---

### Degraded state — AI unavailable
- **Expected behavior:** Core analytics remain usable; AI panel shows fallback message.
- **UX notes:** AI is optional and must not block primary workflows.

---

### Retry policy (v1)
- User-initiated retries only.
- Preserve last successful data whenever possible.

---

## 7) Decisions & Trade-offs

- **AI treated as optional capability**  
  *Consequence:* AI failures never block analytics; UX must clearly communicate limitations.

- **Mock data first**  
  *Consequence:* Data contracts must remain stable to avoid refactors when replacing mocks.

- **Feature modules own UI orchestration; domain stays pure**  
  *Consequence:* Feature modules may grow large; boundaries are enforced via dependency rules.
