# Project Conventions

## Table of Contents

1. [Naming](#naming)
2. [Structure](#structure)
3. [Testing](#testing)

---

## Naming
- Files and folders use kebab-case
- Domain entities use PascalCase
- Functions and variables use camelCase

## Structure
- Business rules live in `domain/`
- Features orchestrate domain logic
- Shared code must be domain-agnostic

## Testing
- Test files: `[ComponentName].test.tsx` or `[hookName].test.ts`
- Tests live in `__tests__/` directories within feature folders
- Follow AAA pattern: Arrange, Act, Assert
- See [TESTING.md](TESTING.md) for comprehensive testing guidelines
