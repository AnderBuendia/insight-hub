# Project Conventions

## Table of Contents

1. [Naming](#naming)
2. [Structure](#structure)
3. [Styling](#styling)
4. [Testing](#testing)

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
