---
applyTo: "src/features/**/state/use*.ts"
---

# Custom Hooks — Instructions

## Role

Custom hooks encapsulate a single, named responsibility: state management, URL sync, async data fetching, or browser API interaction. They are the only layer allowed to own `useState`, `useEffect`, and side effects inside features.

---

## One hook, one responsibility

A hook file owns exactly one concern. If a hook is doing two things, split it.

```
useAnalysis.ts       ← analysis state + recompute
useSnapshots.ts      ← snapshot persistence + selection
useUrlFilters.ts     ← URL param parsing + sync
useCopyToClipboard.ts ← clipboard state + reset timer
```

---

## Return shape

Always return a plain object. Use `{ state, actions }` for hooks that manage domain state, or a flat object for utility hooks.

```ts
// ✅ — domain state hook
return { state, actions };

// ✅ — utility hook (flat is fine when there is no meaningful state/actions split)
return { copied, copy };

// ❌ — array tuple (hard to extend, harder to read at call site)
return [copied, copy];
```

`state` is a plain data object. `actions` is an object of stable functions (wrapped in `useCallback` when passed as props or used in `useEffect` deps).

---

## No JSX, no component imports

A hook file must never import a React component or return JSX.

```ts
// ❌
import { Spinner } from "@/shared/ui/Spinner";
return { node: <Spinner /> };

// ✅
return { isLoading: true };
```

---

## Effects must have cleanup when relevant

Every `useEffect` that sets up a subscription, timer, or listener must return a cleanup function.

```ts
// ❌
useEffect(() => {
  const id = window.setTimeout(() => setCopied(false), resetMs);
}, [copied]);

// ✅
useEffect(() => {
  if (!copied) return;
  const id = window.setTimeout(() => setCopied(false), resetMs);
  return () => window.clearTimeout(id);
}, [copied, resetMs]);
```

---

## `useRef` vs `useState`

Use `useRef` for values that must not trigger a re-render:
- Mutable timers / interval IDs
- "mounted" guards (`mountedRef`)
- Latest-ref pattern (storing the current value of a prop or state for use inside a stale closure)

Use `useState` for values whose change must be visible in the UI.

```ts
// ✅ — timer ID does not need to trigger a render
const timerRef = useRef<number | null>(null);

// ✅ — copied must be reflected in the UI
const [copied, setCopied] = useState(false);
```

---

## No Tailwind, no styling concerns

Hooks are style-agnostic. Any visual consequence of state (color, label, icon) is decided by the UI component consuming the hook.

---

## No imports from `@/infra` in utility hooks

Hooks under `state/` that deal with browser APIs (`useCopyToClipboard`, `useUrlFilters`) must not import from `@/infra`. Only domain-state hooks (`useAnalysis`, `useSnapshots`) may depend on infra modules through `@/infra`.

---

## Async functions: no unhandled rejections

Every `async` function inside a hook must have a `try/catch`. Never let a rejected promise propagate silently.

```ts
// ❌
async function copy(text: string) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
}

// ✅
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  } catch {
    setCopied(false);
  }
}
```

---

## Export style

Named export only. No `export default`.

---

## Checklist before submitting a hook

- [ ] Single responsibility — one concern per file
- [ ] Returns `{ state, actions }` or a meaningful flat object
- [ ] No JSX, no component imports
- [ ] Every effect has cleanup when it sets up a timer/subscription
- [ ] Async functions have `try/catch`
- [ ] `useRef` used for values that must not trigger re-renders
- [ ] No Tailwind classes
- [ ] Named export (no `default`)
