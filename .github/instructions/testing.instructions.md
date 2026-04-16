---
applyTo: "src/**/*.test.{ts,tsx}"
---

# InsightHub — Testing Instructions

## Stack

- **Runner:** Vitest 4.x
- **Library:** React Testing Library + `@testing-library/user-event`
- **Matchers:** `@testing-library/jest-dom/vitest` (auto-loaded via `vitest.setup.ts`)
- **Environment:** jsdom
- **Coverage provider:** v8 — minimum 80% lines / functions / branches / statements

---

## File placement

Co-locate every test with its source file. Mirror the layer structure exactly.

```
src/features/analysis/
  page/
    AnalysisPage.tsx
    AnalysisPage.test.tsx       ← page component test
  ui/
    AnalysisSuccess.tsx
    AnalysisSuccess.test.tsx    ← UI component test
  state/
    useSnapshots.ts
    useSnapshots.test.ts        ← hook test
```

---

## Mandatory structure

Every test file must follow this shell:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { ComponentName } from "@/features/.../ComponentName";

// ── mocks ────────────────────────────────────────────────────────────────────
vi.mock("...");

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("describes the behavior in plain language", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

Rules:
- Always call `cleanup()` in `afterEach`.
- Always call `vi.clearAllMocks()` in `beforeEach` when mocks are present.
- Follow the **AAA** pattern (Arrange / Act / Assert) — one blank line between each phase.
- One behavior per `it`. Never assert two unrelated things in the same test.
- Use `it()` for test cases, `describe()` for grouping — never nest more than two levels deep.

---

## Layer-specific guidance

### Page components (`features/[feature]/page/`)

Page components orchestrate state hooks and Next.js navigation. Mock every hook they consume so the test is fully deterministic.

**What to cover:**
- Missing / invalid URL params → correct empty/fallback state rendered
- Valid params → correct hook calls and UI sections rendered
- Props forwarded correctly to child components (assert via mock shape, not DOM detail)

**Mock pattern:**

```tsx
const mockUseSearchParams = vi.fn();
const mockUseRouter = vi.fn();
const mockUseAnalysis = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => mockUseRouter(),
}));

vi.mock("@/features/analysis/state/useAnalysis", () => ({
  useAnalysis: (datasetId: string | null, initialFilters: unknown) =>
    mockUseAnalysis(datasetId, initialFilters),
}));

// Heavy sub-components that own their own tests should be stubbed
vi.mock("@/features/ai/page/AIPanel", () => ({
  AIPanel: () => <div data-testid="ai-panel" />,
}));
```

**Example:**

```tsx
describe("AnalysisPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ replace: vi.fn() });
    mockUseAnalysis.mockReturnValue({
      state: { status: "success", datasetId: "ds_123", metrics: [], filters: {}, insights: [] },
      actions: { reload: vi.fn(), setFilters: vi.fn() },
    });
    mockUseSnapshots.mockReturnValue({
      state: { status: "empty", snapshots: [], selectedId: undefined },
      actions: { save: vi.fn(), select: vi.fn(), deleteAll: vi.fn(), clearSelection: vi.fn() },
    });
  });

  afterEach(() => { cleanup(); });

  it("renders the missing dataset state when datasetId is not provided", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
    render(<AnalysisPage />);
    expect(screen.getByText("No dataset selected")).toBeInTheDocument();
  });

  it("passes the dataset id to both state hooks", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));
    render(<AnalysisPage />);
    expect(mockUseAnalysis).toHaveBeenCalledWith("ds_123", {});
    expect(mockUseSnapshots).toHaveBeenCalledWith("ds_123");
  });
});
```

---

### UI components (`features/[feature]/ui/`, `shared/ui/`)

Purely presentational — accept all data via props, no external dependencies.

**What to cover:**
- Renders expected content with required props
- Every conditional branch (` prop === "X"`, optional prop present/absent, status variants)
- Callbacks are called with the correct arguments on user interaction
- Loading / error / empty / success visual states when the component owns them

**Render helper pattern:**

Define a typed `renderX()` helper at the top of each test file with sensible defaults. This avoids repeating full prop trees in every `it`.

```tsx
const defaultActions = {
  reload: vi.fn(),
  setFilters: vi.fn(),
};

function renderErrorState(overrides: Partial<Parameters<typeof ErrorState>[0]> = {}) {
  return render(<ErrorState message="Oops" onRetry={vi.fn()} {...overrides} />);
}
```

**User interactions — use `userEvent`, not `fireEvent`:**

```tsx
import userEvent from "@testing-library/user-event";

it("calls onRetry when the retry button is clicked", async () => {
  const onRetry = vi.fn();
  render(<ErrorState message="Oops" onRetry={onRetry} />);

  await userEvent.click(screen.getByRole("button", { name: /retry/i }));

  expect(onRetry).toHaveBeenCalledOnce();
});
```

---

### Custom hooks (`features/[feature]/state/`)

Use `renderHook` and `act` from `@testing-library/react`. Mock infra dependencies via `vi.mock("@/infra", ...)`.

**What to cover:**
- Initial state shape — every field
- State transitions triggered by each returned action
- Async operations: loading → success / error
- Cleanup / stale state scenarios (e.g., stale persisted IDs)

**Pattern:**

```ts
import { act, renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { AnalysisSnapshotsInfra } from "@/infra";

vi.mock("@/infra", () => ({
  AnalysisSnapshotsInfra: {
    listSnapshots: vi.fn(),
    saveSnapshot: vi.fn(),
  },
}));

const mockListSnapshots = vi.mocked(AnalysisSnapshotsInfra.listSnapshots);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useSnapshots", () => {
  it("returns status empty when there are no snapshots", async () => {
    mockListSnapshots.mockResolvedValue([]);

    const { result } = renderHook(() => useSnapshots("ds_1"));

    await act(async () => {});

    expect(result.current.state.status).toBe("empty");
  });
});
```

---

### Infrastructure (`infra/[feature]/`)

Test repository functions in isolation. Control the mock scenario via the exported `setXScenario()` helper when available, or `vi.spyOn` for async calls.

**What to cover:**
- Success path returns `{ ok: true, data: ... }`
- Error / not-found paths return `{ ok: false, error: { code, message } }`
- Data shape matches the infra type contract

---

## Mocking reference

| Dependency | Pattern |
|---|---|
| `next/navigation` hooks | `vi.mock("next/navigation", () => ({ useSearchParams: () => mockFn(), useRouter: () => mockFn() }))` |
| Infra modules | `vi.mock("@/infra", () => ({ XInfra: { method: vi.fn() } }))` |
| Feature-level hooks | `vi.mock("@/features/.../useX", () => ({ useX: mockFn }))` |
| Heavy sub-components | `vi.mock("@/features/.../Panel", () => ({ Panel: () => <div data-testid="panel" /> }))` |

Access typed mocks with `vi.mocked(fn)` — never cast manually.

---

## Query priority (Testing Library)

1. `getByRole` — preferred; reflects real accessibility tree
2. `getByLabelText` — for form inputs
3. `getByText` — for static copy
4. `getByTestId` — last resort, only for stub components or non-accessible elements

Never use `container.querySelector`.

---

## What NOT to test

- CSS class names or Tailwind tokens
- Internal implementation details (private state, intermediate variables)
- Snapshot tests — this project does not use them
- Things already covered by a child component's own test (trust the layer boundary)

---

## Coverage checklist

- [ ] All `status` variants rendered (idle / loading / error / success / empty)
- [ ] Every optional prop tested both present and absent
- [ ] Every callback prop asserted to have been called with the right arguments
- [ ] Async state transitions covered with `waitFor` or `act`
- [ ] Hook initial state and all action transitions covered
- [ ] Error / not-found paths in infra covered
