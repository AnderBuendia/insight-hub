# Testing Guidelines

This document defines the standard approach for writing and organizing tests across the InsightHub codebase.

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Configuration](#test-configuration)
3. [Test Structure Standards](#test-structure-standards)
4. [Component Type Guidelines](#component-type-guidelines)
5. [Mocking Patterns](#mocking-patterns)
6. [Best Practices](#best-practices)
7. [Coverage Requirements](#coverage-requirements)

---

## Testing Philosophy

- **Test behavior, not implementation** — Focus on what the component does, not how it does it
- **Write tests alongside features** — Tests are part of feature development, not an afterthought
- **Maintain test isolation** — Each test should be independent and not rely on other tests
- **Use descriptive test names** — Test names should clearly describe the scenario and expected outcome
- **Follow AAA pattern** — Arrange, Act, Assert for clarity and consistency

---

## Test Configuration

### Tools & Libraries

- **Test Runner:** Vitest 4.x
- **Testing Library:** React Testing Library + jest-dom
- **Environment:** jsdom (browser simulation)
- **Coverage:** v8 provider with 50% minimum threshold

### Setup Files

**`vitest.config.ts`** — Test runner configuration
```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html"],
  thresholds: { lines: 50, functions: 50, branches: 50, statements: 50 }
}
```

**`vitest.setup.ts`** — Global test setup (jest-dom matchers)
```typescript
import "@testing-library/jest-dom/vitest";
```

---

## Test Structure Standards

### File Organization

**Mirror Structure (Co-located Tests)**

Tests are co-located with their source files to improve discoverability and maintainability.

```
src/
  features/
    [feature-name]/
      page/
        [ComponentName].tsx
        [ComponentName].test.tsx    # ✅ Test next to component
      ui/
        [ComponentName].tsx
        [ComponentName].test.tsx    # ✅ Test next to component
      state/
        [hookName].ts
        [hookName].test.ts          # ✅ Test next to hook
```

**Rationale:**
- **Easy refactoring**: Moving/renaming a component automatically includes its test
- **Intuitive navigation**: Open a file, its test is right there
- **Clear organization**: Type structure (page/ui/state) is preserved
- **Better DX**: Quick access to tests during development

### Naming Conventions

- **Test files:** `[ComponentName].test.tsx` or `[hookName].test.ts`
- **Test suites:** Use `describe()` for component/feature name
- **Test groups:** Use nested `describe()` for logical groupings (e.g., "Empty State", "Success State")
- **Test cases:** Use `it()` with descriptive, behavior-focused names

### Standard Test Template

```typescript
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { ComponentName } from "@/path/to/ComponentName";

// Mocks (if needed)
const mockDependency = vi.fn();

vi.mock("dependency-path", () => ({
  dependency: () => mockDependency(),
}));

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Scenario Group 1", () => {
    it("describes expected behavior in this scenario", () => {
      // Arrange: Set up test data and mocks
      mockDependency.mockReturnValue("value");

      // Act: Render component or trigger action
      render(<ComponentName prop="value" />);

      // Assert: Verify expected outcome
      expect(screen.getByText("Expected Text")).toBeInTheDocument();
    });
  });
});
```

---

## Component Type Guidelines

### 1. Page Components (`features/[feature]/page/`)

**Characteristics:**
- Client-side components that orchestrate feature logic
- May use Next.js hooks (useSearchParams, useRouter)
- Handle routing and URL parameters
- Compose UI components and layouts

**Test Focus:**
- ✅ URL parameter handling (presence, absence, validation)
- ✅ State-based rendering (empty, loading, error, success)
- ✅ Navigation behavior
- ✅ Integration with layout components

**Standard Structure:**
```typescript
describe("FeaturePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Empty State", () => {
    it("renders empty state when required params missing", () => {
      // Test empty state rendering
    });

    it("displays appropriate call-to-action", () => {
      // Test CTA links/buttons
    });
  });

  describe("Success State", () => {
    it("renders main content when params valid", () => {
      // Test successful render
    });

    it("displays expected UI sections", () => {
      // Test presence of key sections
    });
  });

  describe("URL Parameter Handling", () => {
    it("extracts and uses URL parameters correctly", () => {
      // Test param extraction
    });

    it("handles invalid/missing parameters gracefully", () => {
      // Test edge cases
    });
  });
});
```

**Example:**
```typescript
// src/features/analysis/__tests__/AnalysisPage.test.tsx
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { AnalysisPage } from "@/features/analysis/page/AnalysisPage";

const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

describe("AnalysisPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Empty State", () => {
    it("renders empty state when no datasetId is provided", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
      render(<AnalysisPage />);
      expect(screen.getByText("No dataset selected.")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("renders analysis layout when datasetId is provided", () => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams("datasetId=ds_123"));
      render(<AnalysisPage />);
      expect(screen.getByText("Dataset Analysis")).toBeInTheDocument();
    });
  });
});
```

---

### 2. UI Components (`features/[feature]/ui/` or `shared/ui/`)

**Characteristics:**
- Presentational components
- Accept data via props
- No external dependencies or API calls
- Focus on rendering and user interactions

**Test Focus:**
- ✅ Props-based rendering variations
- ✅ User interactions (clicks, inputs, form submissions)
- ✅ Conditional rendering based on props
- ✅ Accessibility (roles, labels, aria attributes)

**Standard Structure:**
```typescript
describe("ComponentName", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders with required props", () => {
      // Test basic render
    });

    it("displays all provided content", () => {
      // Test content display
    });

    it("applies correct styling/classes", () => {
      // Test visual presentation
    });
  });

  describe("Props Variations", () => {
    it("renders differently based on prop X", () => {
      // Test prop variations
    });

    it("handles optional props correctly", () => {
      // Test optional props
    });
  });

  describe("User Interactions", () => {
    it("calls callback when user interacts", () => {
      // Test event handlers
    });

    it("updates internal state on interaction", () => {
      // Test stateful behavior
    });
  });

  describe("Accessibility", () => {
    it("has correct ARIA attributes", () => {
      // Test a11y
    });

    it("is keyboard navigable", () => {
      // Test keyboard support
    });
  });
});
```

**Example:**
```typescript
// src/shared/ui/PageShell.test.tsx
import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import { PageShell } from "@/shared/ui/PageShell";

describe("PageShell", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("renders title and children", () => {
      render(
        <PageShell title="Test Page">
          <div>Content</div>
        </PageShell>
      );
      
      expect(screen.getByText("Test Page")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders as main landmark", () => {
      render(<PageShell title="Test">Content</PageShell>);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
```

---

### 3. Layout Components (`features/[feature]/ui/` for layouts)

**Characteristics:**
- Structural components that organize other components
- Accept slots/children as props (left, right, header, footer, etc.)
- Handle responsive layouts and grid systems

**Test Focus:**
- ✅ All slots render correctly
- ✅ Layout structure is maintained
- ✅ Optional slots are handled gracefully
- ✅ Header/footer/subtitle conditional rendering

**Standard Structure:**
```typescript
describe("LayoutComponent", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Slot Rendering", () => {
    it("renders all provided slots", () => {
      // Test all slots present
    });

    it("handles missing optional slots", () => {
      // Test missing slots
    });
  });

  describe("Layout Structure", () => {
    it("maintains correct DOM hierarchy", () => {
      // Test structure
    });

    it("applies layout styles correctly", () => {
      // Test styling
    });
  });
});
```

---

### 4. Custom Hooks (`features/[feature]/state/`)

**Characteristics:**
- Reusable stateful logic
- May interact with external APIs or context
- Return state and handler functions

**Test Focus:**
- ✅ Initial state values
- ✅ State updates via returned handlers
- ✅ Side effects (API calls, subscriptions)
- ✅ Cleanup on unmount

**Standard Structure:**
```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useCustomHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("returns initial values correctly", () => {
      const { result } = renderHook(() => useCustomHook());
      expect(result.current.state).toEqual(initialValue);
    });
  });

  describe("State Updates", () => {
    it("updates state when handler called", async () => {
      const { result } = renderHook(() => useCustomHook());
      
      act(() => {
        result.current.handler("value");
      });
      
      await waitFor(() => {
        expect(result.current.state).toBe("value");
      });
    });
  });

  describe("Side Effects", () => {
    it("triggers API call on mount", async () => {
      renderHook(() => useCustomHook());
      
      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalled();
      });
    });
  });
});
```

---

### 5. Infrastructure/Repository (`infra/`)

**Characteristics:**
- Data access layer
- API calls, data transformation
- Return typed results (success/error)

**Test Focus:**
- ✅ Success cases with valid data
- ✅ Error cases and error handling
- ✅ Data transformation/mapping
- ✅ Network failure scenarios

**Standard Structure:**
```typescript
describe("FeatureInfra", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Success Cases", () => {
    it("returns data on successful call", async () => {
      // Test success
    });

    it("transforms data correctly", async () => {
      // Test transformation
    });
  });

  describe("Error Cases", () => {
    it("returns error on failed call", async () => {
      // Test error
    });

    it("handles network errors gracefully", async () => {
      // Test network failure
    });
  });
});
```

---

## Mocking Patterns

### Next.js Navigation Hooks

```typescript
// Mock useSearchParams
const mockUseSearchParams = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

// Usage in test
mockUseSearchParams.mockReturnValue(new URLSearchParams("param=value"));
```

```typescript
// Mock useRouter
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));
```

### Infrastructure/API Calls

```typescript
import { DatasetsInfra } from "@/infra";

vi.spyOn(DatasetsInfra, "listDatasets").mockResolvedValue({
  ok: true,
  data: [{ id: "1", name: "Dataset 1" }],
});
```

### External Dependencies

```typescript
vi.mock("external-library", () => ({
  someFunction: vi.fn(() => "mocked value"),
}));
```

---

## Best Practices

### ✅ Do

- **Write descriptive test names** that explain the scenario and expectation
- **Test user-facing behavior**, not implementation details
- **Use `screen` queries** from Testing Library for better error messages
- **Clean up after each test** with `afterEach(cleanup)`
- **Mock external dependencies** (APIs, navigation, etc.)
- **Use `waitFor`** for async operations and state updates
- **Group related tests** with nested `describe` blocks
- **Test accessibility** features (roles, labels, keyboard navigation)
- **Follow AAA pattern** (Arrange, Act, Assert) for clarity

### ❌ Don't

- **Test implementation details** (internal state, private methods)
- **Use `querySelector`** or other DOM queries directly (prefer Testing Library queries)
- **Skip cleanup** between tests (causes test pollution)
- **Write tests that depend on execution order**
- **Mock what you don't own** excessively (test real behavior when possible)
- **Test multiple behaviors in one test** (keep tests focused)
- **Use snapshot tests as primary testing strategy**
- **Assert on styling/CSS classes** unless critical to functionality

---

## Coverage Requirements

### Minimum Thresholds (Enforced in CI)

- **Lines:** 50%
- **Functions:** 50%
- **Branches:** 50%
- **Statements:** 50%

### Coverage Strategy

1. **Prioritize critical paths** — Focus on business logic and user flows first
2. **Test error scenarios** — Don't just test happy paths
3. **Cover edge cases** — Empty states, loading states, validation errors
4. **Integration over unit** — Test how components work together

### Running Coverage

```bash
# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (no coverage)
npm test

# Run specific test file
npm test -- path/to/test.test.tsx
```

---

## File Location Reference

| Component Type | Location | Test Location | Example |
|---------------|----------|---------------|---------|
| Page Component | `features/[feature]/page/` | `features/[feature]/page/` | `DatasetsPage.test.tsx` |
| UI Component (feature) | `features/[feature]/ui/` | `features/[feature]/ui/` | `DatasetList.test.tsx` |
| UI Component (shared) | `shared/ui/` | `shared/ui/` | `PageShell.test.tsx` |
| Layout Component | `features/[feature]/ui/` | `features/[feature]/ui/` | `AnalysisLayout.test.tsx` |
| Custom Hook | `features/[feature]/state/` | `features/[feature]/state/` | `useDatasets.test.ts` |
| Infrastructure | `infra/[feature]/` | `infra/[feature]/` | `repository.test.ts` |
| Domain Logic | `domain/` | `domain/` | `datasets.test.ts` |

**Note:** Tests are co-located with their source files (mirror structure) for easier maintenance and navigation.

---

## Quick Reference Cheatsheet

### Common Queries (Testing Library)

```typescript
// By text content
screen.getByText("Submit")
screen.queryByText("Optional") // Returns null if not found

// By role (preferred for accessibility)
screen.getByRole("button", { name: /submit/i })
screen.getByRole("heading", { name: "Title" })

// By label (forms)
screen.getByLabelText("Email")

// By placeholder
screen.getByPlaceholderText("Enter email...")

// Multiple elements
screen.getAllByRole("listitem")

// Async queries
await screen.findByText("Loaded") // Waits for element
```

### Common Assertions

```typescript
// Presence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()

// Attributes
expect(element).toHaveAttribute("href", "/path")
expect(element).toHaveClass("active")

// Text content
expect(element).toHaveTextContent("Text")

// Form elements
expect(input).toHaveValue("value")
expect(checkbox).toBeChecked()

// Function calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith("arg")
expect(mockFn).toHaveBeenCalledTimes(2)
```

---

## Examples by Typeare co-located with their source files:

- **Page Component:** `src/features/analysis/page/AnalysisPage.test.tsx`
- **UI Components:** 
  - `src/features/datasets/ui/DatasetList.test.tsx`
  - `src/features/datasets/ui/ScenarioControls.test.tsx`
- **Page with State:** `src/features/datasets/page
- **Page Component:** `src/features/analysis/__tests__/AnalysisPage.test.tsx`
- **UI Component:** `src/features/datasets/__tests__/DatasetsPage.test.tsx`
- **Setup Reference:** `vitest.setup.ts`, `vitest.config.ts`

---

## Continuous Improvement

This testing guide is a living document. As the project evolves:

- Update patterns based on learnings
- Add new component types as they emerge
- Refine coverage strategy based on team feedback
- Document new mocking patterns as needed

For questions or suggestions, create an issue or propose changes via PR.
