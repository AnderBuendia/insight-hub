---
applyTo: "src/features/**/ui/**/*.tsx,src/shared/ui/**/*.tsx"
---

# UI Components — Instructions

## Role

UI components are **purely presentational**. They receive data and callbacks via props and render markup. They have no knowledge of where data comes from or what happens after a callback fires.

---

## Hard rules

### No logic, no side effects

```tsx
// ❌ — fetching, state hooks, and effects do not belong here
export function MetricsList() {
  const [metrics, setMetrics] = useState([]);
  useEffect(() => { fetch("/api/metrics").then(...) }, []);
  ...
}

// ✅ — receive everything via props
export function MetricsList({ metrics }: { metrics: Metric[] }) { ... }
```

Forbidden inside a UI component:
- `useState` (except for purely local ephemeral UI state with no business meaning, e.g. a tooltip open/close)
- `useEffect`, `useLayoutEffect`
- `useRouter`, `useSearchParams`
- Any import from `@/infra` or `@/features/.../state/`

### Props must be explicit and fully typed

Inline the prop type directly on the function signature. Do not use `React.FC`, do not spread unknown objects.

```tsx
// ❌
const MetricsList: React.FC<Props> = ({ metrics }) => { ... }

// ✅
export function MetricsList({ metrics }: { metrics: Metric[] }) { ... }
```

### Callbacks are always named `onX`

Every callback prop follows the `on` + verb convention: `onCopy`, `onRetry`, `onSelect`, `onDeleteAll`.

The component **never decides** what happens — it only calls the callback:

```tsx
// ❌ — component making a decision
function ShareButton({ url }: { url: string }) {
  return <button onClick={() => navigator.clipboard.writeText(url)}>Copy</button>;
}

// ✅ — decision delegated to the caller
function ShareButton({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return <button type="button" onClick={onCopy}>Copy</button>;
}
```

### Action groups as a named prop object

When a component needs multiple related callbacks, group them under a single named prop rather than spreading them as individual props.

```tsx
// ❌
<SnapshotsPanel onSave={...} onSelect={...} onDeleteAll={...} />

// ✅
<SnapshotsPanel actions={{ save, select, deleteAll }} />
```

### Styling lives only in `ui/`

Tailwind classes belong exclusively in `ui/` components. No className attributes in `page/` or `state/` files. See `CONVENTIONS.md`.

### No cross-feature imports

A UI component may only import from:
- `@/shared/ui/` (shared primitives)
- `@/domain` (types only — `import type`)
- Other components within the same feature's `ui/` folder

```tsx
// ❌ — importing a UI component from another feature
import { DatasetCard } from "@/features/datasets/ui/DatasetCard";

// ✅ — importing a shared primitive
import { PageShell } from "@/shared";
```

---

## Export style

Named exports only. No `export default`.

```tsx
// ❌
export default function MetricsList(...) {}

// ✅
export function MetricsList(...) {}
```

---

## Conditional rendering

Prefer early returns for status-driven variants. Avoid ternary chains longer than two branches.

```tsx
// ❌
return status === "loading" ? <Spinner /> : status === "error" ? <Error /> : <Content />;

// ✅
if (status === "loading") return <LoadingState />;
if (status === "error") return <ErrorState />;
return <Content />;
```

---

## Checklist before submitting a UI component

- [ ] No `useState` / `useEffect` for non-cosmetic logic
- [ ] No imports from `@/infra` or `state/` hooks
- [ ] All callbacks named `onX`
- [ ] Props typed inline on the function
- [ ] Named export (no `default`)
- [ ] Tailwind classes present (not in a `page/` or `state/` file)
