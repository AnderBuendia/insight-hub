---
applyTo: "src/features/**/index.ts"
---

# Feature Index — Instructions

## Role

`src/features/[feature]/index.ts` is the **public API** of a feature module. It is the only file other features and `src/app/` are allowed to import from. Everything not exported here is private to the feature.

---

## Export only the public entry point

Each feature exposes exactly one top-level entry point: the page component.

```ts
// ✅ — src/features/analysis/index.ts
export { AnalysisPage } from "@/features/analysis/page/AnalysisPage";

// ✅ — src/features/datasets/index.ts
export { DatasetsPage } from "./page/DatasetsPage";
```

---

## Do not re-export internal implementation

UI components, state hooks, infra adapters, and internal types must not appear in the feature index unless they are explicitly designed for cross-feature reuse (which is rare — use `src/shared/` instead).

```ts
// ❌ — leaking internals
export { AnalysisSuccess } from "@/features/analysis/ui/AnalysisSuccess";
export { useAnalysis } from "@/features/analysis/state/useAnalysis";
export type { AnalysisState } from "@/features/analysis/state/types";

// ✅ — only the page
export { AnalysisPage } from "@/features/analysis/page/AnalysisPage";
```

If another feature genuinely needs a type or component from this feature, that is a signal to move it to `src/shared/` or `src/domain/`, not to expand the index.

---

## Cross-feature imports go through the index only

When one feature needs something from another, it must import from the other feature's index — never from a deep internal path.

```ts
// ❌ — deep import from another feature
import { useSnapshots } from "@/features/analysis/state/useSnapshots";

// ✅ — through the public index
import { AnalysisPage } from "@/features/analysis";
```

---

## `src/app/` routes import from feature indexes

Next.js route files (`src/app/[route]/page.tsx`) import the page component from the feature index, not from a deep path.

```tsx
// ✅ — src/app/analysis/page.tsx
import { AnalysisPage } from "@/features/analysis";

export default function Page() {
  return <AnalysisPage />;
}
```

---

## No logic in the index file

The index is a pure re-export barrel. No functions, no hooks, no constants, no side effects.

```ts
// ❌
export const ANALYSIS_ROUTE = "/analysis";
export function createAnalysisURL(datasetId: string) { ... }

// ✅ — put utilities in domain or shared, then import from there
```

---

## Checklist before submitting a feature index

- [ ] Only the public page component(s) are exported
- [ ] No UI components, hooks, or internal types exported
- [ ] No logic or constants defined in the file
- [ ] External consumers import from this index, not from deep paths
