---
applyTo: "src/infra/**/*.ts"
---

# Infrastructure — Instructions

## Role

`src/infra/` is the I/O layer. It talks to data sources (mock or real), maps external representations to domain types, and exposes a typed result to the rest of the application. It contains no business decisions.

---

## Result type: never throw, always return

Every public repository function returns a typed result object. It must never `throw` — errors are part of the return type.

```ts
// ❌
export async function getAnalysis(datasetId: string): Promise<InfraAnalysis> {
  if (!data) throw new Error("Not found");
  return data;
}

// ✅
export type GetAnalysisResult =
  | { ok: true; data: InfraAnalysis }
  | { ok: false; error: { code: "NOT_FOUND" | "UNEXPECTED"; message: string } };

export async function getAnalysis(datasetId: string): Promise<GetAnalysisResult> {
  if (!data) return { ok: false, error: { code: "NOT_FOUND", message: `...` } };
  return { ok: true, data };
}
```

Error codes are string literals defined in the result type. Never use raw `Error` objects in the return value.

---

## Infra types stay inside `@/infra`

`InfraMetric`, `InfraFilter`, `InfraAnalysis`, etc. are internal mapping types. They must not be consumed outside of `src/infra/`. The feature layer works with domain types only.

```ts
// ❌ — in a feature hook
import type { InfraAnalysis } from "@/infra/analysis/types";

// ✅ — infra maps internally; feature receives domain types
import type { Metric } from "@/domain";
```

The only exports from `src/infra/index.ts` that cross the boundary are repository namespaces (`AnalysisInfra`, `DatasetsInfra`, …) and scenario-control types needed for tests.

---

## Scenario control via `setXScenario()`

Every repository must expose a `setXScenario()` function to control mock behavior in tests and dev tooling. The active scenario is module-level private state.

```ts
type AnalysisScenario = "success" | "empty" | "error";
let scenario: AnalysisScenario = "success";

export function setAnalysisScenario(next: AnalysisScenario) {
  scenario = next;
}
```

Tests control behavior through `setXScenario()`. They must not import mock data files directly.

```ts
// ❌ — in a test
import { mockAnalysisByDatasetId } from "@/infra/analysis/mockAnalysis";

// ✅
import { AnalysisInfra } from "@/infra";
AnalysisInfra.setAnalysisScenario("error");
```

---

## Mock data in dedicated files

Static mock fixtures live in `mock*.ts` files (e.g., `mockAnalysis.ts`, `mockDatasets.ts`). They are imported only by the repository in the same folder — never by features, tests, or other infra modules.

---

## No business logic

Infra functions transform data shapes and handle I/O. They must not compute metrics, derive insights, apply filters, or make product decisions.

```ts
// ❌ — business logic in infra
export async function getAnalysis(datasetId: string) {
  const raw = mockData[datasetId];
  return { metrics: computeMetrics(raw) }; // computeMetrics is a domain function
}

// ✅ — return raw data; let the domain/feature layer compute
export async function getAnalysis(datasetId: string): Promise<GetAnalysisResult> {
  const raw = mockData[datasetId];
  if (!raw) return { ok: false, error: { code: "NOT_FOUND", message: "..." } };
  return { ok: true, data: raw };
}
```

---

## No imports from `@/features`

Infra may import from `@/domain` (types only). It must not import from `@/features`, `@/app`, or `@/shared/ui`.

---

## Export via `src/infra/index.ts`

Every repository is re-exported from `src/infra/index.ts` as a namespace. Features import from `@/infra`, never from deep paths.

```ts
// ✅ — in infra/index.ts
export * as AnalysisInfra from "./analysis/repository";

// ✅ — in a feature hook
import { AnalysisInfra } from "@/infra";

// ❌ — deep import
import { getAnalysis } from "@/infra/analysis/repository";
```

---

## Checklist before submitting infra code

- [ ] Public functions return `{ ok: true, data } | { ok: false, error }` — no throws
- [ ] `InfraX` types not exported from `src/infra/index.ts` (only repository namespaces)
- [ ] `setXScenario()` exported for test control
- [ ] Mock data in a dedicated `mock*.ts` file, not inlined in the repository
- [ ] No domain logic (computations, derivations, business rules)
- [ ] No imports from `@/features`, `@/app`, or `@/shared/ui`
- [ ] Named exports only (no `export default`)
