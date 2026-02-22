# Project Conventions

## Table of Contents

1. [Naming](#naming)
2. [Structure](#structure)
3. [Styling](#styling)
4. [Code Quality & Linting](#code-quality--linting)
5. [Testing](#testing)
6. [Branching & Versioning](#branching--versioning)
7. [CI Expectations](#ci-expectations)

---

## Naming
- Files and folders use kebab-case
- Domain entities use PascalCase
- Functions and variables use camelCase

## Structure
- Business rules live in `domain/`
- Features orchestrate domain logic
- Shared code must be domain-agnostic

## Styling
- **Tailwind CSS classes only live in `/ui` directories**
- Components in `/page`, `/state`, or other directories must not contain Tailwind classes
- Extract styled components to `/ui` when styling is needed
- This keeps presentation logic separate from business and coordination logic

**Example:**
```tsx
// ❌ Bad: Tailwind in /page
// src/features/analysis/page/AnalysisPage.tsx
<div className="space-y-4">
  <p className="text-sm">Content</p>
</div>

// ✅ Good: Tailwind in /ui
// src/features/analysis/ui/ContentCard.tsx
export function ContentCard() {
  return (
    <div className="space-y-4">
      <p className="text-sm">Content</p>
    </div>
  );
}

// src/features/analysis/page/AnalysisPage.tsx
<ContentCard />
```

## Code Quality & Linting

ESLint is configured with strict rules to maintain code quality and consistency.

### Key Rules Enforced

**Code Quality:**
- **No console.log** — Warns on `console.log` statements (use proper logging or debugging tools)
- **Unused variables** — Error (not warning) for unused variables/constants
  - Exception: Variables prefixed with `_` are allowed (e.g., `_unusedParam`)
- **Prefer const** — Use `const` over `let` when variables are never reassigned
- **No var** — Only `let` and `const` are allowed
- **Strict equality** — Always use `===` and `!==` (never `==` or `!=`)
- **No debugger** — Debugger statements are not allowed in production code

**Formatting:**
- **No trailing spaces** — Lines must not end with whitespace
- **Trailing commas** — Required in multiline arrays/objects for cleaner diffs
- **Max line length** — 170 characters (URLs, strings, and template literals are exempt)
- **No multiple empty lines** — Maximum of 1 consecutive empty line
- **Semicolons** — Always required
- **Double quotes** — Enforce double quotes for strings

**TypeScript:**
- **Explicit return types** — Function return types should be explicit (warning)
- **No explicit any** — Avoid `any` type when possible (warning)
- **Type-only imports** — Use `import type` for type-only imports

**React:**
- **Self-closing components** — Components without children must be self-closing
- **Boolean props** — Omit value when `true` (e.g., `<Component enabled />` not `<Component enabled={true} />`)
- **Exhaustive deps** — React hooks dependencies must be complete (warning)

### Running the Linter

```bash
# Check for linting errors
npm run lint

# Auto-fix issues when possible
npm run lint -- --fix
```

ESLint runs automatically on commit via Husky hooks for staged files.

## Testing
- Test files: `[ComponentName].test.tsx` or `[hookName].test.ts`
- Tests are co-located with their source files (mirror structure)
- Test files live next to the component they test (e.g., `Component.tsx` → `Component.test.tsx`)
- Follow AAA pattern: Arrange, Act, Assert
- See [TESTING.md](TESTING.md) for comprehensive testing guidelines

## Branching & Versioning

This project uses **Trunk-Based Development** (see ADR-0002).

### Branching
- `main` is the single integration trunk and should always be green.
- Feature branches are short-lived and created from `main`.
- Branch naming:
  - `IHSQD-<id>-<short-slug>` (example: `IHSQD-22-trunk-cutover`)
- Avoid long-lived `*-rc` branches for regular development.
  - If stabilization is needed, use short-lived `release/x.y` branches only.

### Versioning
- We use SemVer for releases: `vX.Y.Z`
- Release candidates are tagged (immutable): `vX.Y.Z-rc.N`
- Tags are the source of truth for release milestones (not branches).

## CI Expectations

- CI must pass before merging to `main`:
  - lint, typecheck, build, tests, and coverage thresholds
- Coverage thresholds are enforced in CI (currently 50%).
- Pre-commit hooks run fast checks on staged files.
- Pre-push hooks run the test suite to catch failures early.
