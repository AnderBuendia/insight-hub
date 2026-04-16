---
applyTo: "src/domain/**/*.ts"
---

# Domain — Instructions

## Role

`src/domain/` is the framework-agnostic core of the application. It defines business concepts, types, and pure functions. Every other layer depends on domain; domain depends on nothing.

---

## Absolute import rules

The domain layer must have **zero imports** from:

```ts
// ❌ — all of these are forbidden in src/domain/
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAnalysis } from "@/infra/analysis/repository";
import { useAnalysis } from "@/features/analysis/state/useAnalysis";
```

Allowed imports:
- Other files within `src/domain/` itself
- Pure TypeScript standard library (`type` imports from `@/domain` re-exports are fine)

---

## Only pure functions and types

Domain files export types and pure functions. No classes, no singletons, no mutable module-level state.

```ts
// ❌ — mutable state at module level
let activeFilters: AnalysisFilters = {};

// ✅ — pure function
export function applyFilters(dataset: number[], filters: AnalysisFilters = {}): number[] { ... }
```

A pure function:
- Returns the same output for the same input
- Has no side effects (no I/O, no mutation of external state, no random)
- Does not throw for expected inputs — return a typed result instead

---

## Types are the source of truth

Domain types define the contract. `infra/` and `features/` adapt to domain types — never the other way around.

```ts
// ✅ — domain defines Metric
export type Metric =
  | { type: "total"; value: number }
  | { type: "count"; value: number }
  | { type: "average"; value: number };

// ✅ — infra maps its own InfraMetric → Metric (in infra layer, not here)
```

If a type leaks infra concepts (e.g., database IDs, API field names, HTTP status codes), it does not belong in domain.

---

## Discriminated unions for variants

Model multi-state concepts with discriminated unions. Do not use nullable fields as implicit state.

```ts
// ❌
export type AnalysisResult = {
  data?: Analysis;
  error?: string;
};

// ✅
export type AnalysisResult =
  | { ok: true; data: Analysis }
  | { ok: false; error: { code: string; message: string } };
```

---

## No `export default`

All exports are named.

```ts
// ❌
export default function applyFilters(...) {}

// ✅
export function applyFilters(...) {}
```

---

## Document invariants with comments

When a function enforces a business rule that is not obvious from the signature, add a short comment above it.

```ts
// Metrics are only meaningful for non-empty datasets.
// Returns [] for empty input — callers must handle this case explicitly.
export function computeMetrics(data: number[]): Metric[] { ... }
```

---

## Domain changes require a Domain Model update

Any addition of a new entity, type, or invariant must be reflected in `docs/domain/DOMAIN_MODEL.md`. Non-trivial decisions must produce an ADR in `docs/decisions/`.

---

## Checklist before submitting domain code

- [ ] Zero imports from `react`, `next`, `@/infra`, `@/features`, `@/shared`
- [ ] Only pure functions and types — no mutable module state
- [ ] Multi-state concepts use discriminated unions
- [ ] Named exports only (no `default`)
- [ ] Invariants documented with a comment when not obvious from the type
- [ ] `docs/domain/DOMAIN_MODEL.md` updated if a new entity or invariant was added
