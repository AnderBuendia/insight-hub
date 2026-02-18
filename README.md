# InsightHub

> A web-based data exploration and analysis tool with AI-assisted insights

InsightHub empowers users to explore datasets, analyze metrics with custom filters, and leverage AI-assisted querying for deeper insights—all within a clean, predictable architecture.

## ✨ Key Features

- 📊 **Dataset Exploration** — Browse and manage multiple datasets
- 📈 **Metrics & Analytics** — Derive and track key performance indicators
- 🔍 **Advanced Filtering** — Scope analysis with flexible filter criteria
- 🤖 **AI-Powered Insights** — Ask questions in dataset context (optional, degraded mode supported)
- 🎯 **Analysis Snapshots** — Save and share analysis views

## 🏗️ Architecture Principles

- **Clear Domain Boundaries** — Domain-driven design with explicit entity relationships
- **Feature-Based Structure** — Organized by user-facing capabilities, not technical layers
- **Explicit System States** — Graceful handling of empty, error, and degraded states
- **Testability First** — 50% minimum coverage enforced in CI

---

## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Testing** | Vitest 4, React Testing Library, jsdom |
| **Quality** | ESLint, TypeScript, Husky, lint-staged |
| **CI/CD** | GitHub Actions (lint, typecheck, build, test with coverage) |

---

## 🎯 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run typecheck` | Run TypeScript type checks |
| `npm test` | Run unit tests in watch mode |
| `npm run test:coverage` | Run tests with coverage enforcement (50% threshold) |

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

### Architecture

**[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — High-level structure, layers, and design principles

**[CONVENTIONS.md](docs/CONVENTIONS.md)** — Code conventions, patterns, and best practices

**[TESTING.md](docs/TESTING.md)** — Testing guidelines, standards, and patterns for all component types

**[DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md)** — Quality checklist for feature completion

### Domain

**[DOMAIN.md](docs/DOMAIN.md)** — Core entities, relationships, and business rules

### Decisions

**[ADRs](docs/decisions/)** — Architecture Decision Records documenting significant technical choices

---

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router (routes & layouts)
├── domain/           # Business entities and domain rules
├── features/         # Feature modules (datasets, analysis, ai)
│   ├── datasets/     # Dataset exploration feature
│   │   ├── page/     # Page components + tests
│   │   ├── ui/       # UI components + tests
│   │   └── state/    # Custom hooks + tests
│   ├── analysis/     # Analytics and metrics feature
│   │   ├── page/     # Page components + tests
│   │   └── ui/       # UI components + tests
│   └── ai/           # AI-assisted insights feature
├── infra/            # External integrations and data repositories
└── shared/           # Reusable UI components and utilities
```

**Testing Structure:** Tests are co-located with their source files (e.g., `Component.tsx` → `Component.test.tsx`) for easier maintenance and navigation.

---

## 🧪 Testing & Quality

- **Unit Tests:** Vitest + React Testing Library
- **Coverage Threshold:** 50% minimum (statements, branches, functions, lines)
- **CI Enforcement:** Tests run on every PR with automatic coverage reports
- **Pre-commit Hooks:** Lint and format checks via Husky + lint-staged
- **Pre-push Hooks:** Full test suite execution

### Coverage Reports

Pull requests automatically receive coverage reports with:
- 🟢 Overall metrics with pass/fail indicators
- 📊 Per-directory breakdown
- 📈 Trend tracking across commits

---

## 🛠️ Development Workflow

1. **Create feature branch** from `main`
2. **Develop with tests** — Write tests alongside features
3. **Run quality checks** — Hooks run automatically on commit/push
4. **Open Pull Request** — CI runs full quality gates
5. **Review coverage report** — Check automated PR comment
6. **Merge after approval** — Squash and merge to `main`
7. **Tag milestone releases** — use `vX.Y.Z-rc.N` tags for release candidates

---

## 🚢 Release & Branching Strategy

This project follows **Trunk-Based Development** (ADR-0002):

- `main` is the single integration trunk and is always expected to be green.
- Work is done in short-lived feature branches (e.g., `IHSQD-123-some-change`) targeting `main`.
- Releases are tracked via **immutable tags** (no long-lived `*-rc` development branches).

### Tagging
- Release candidates: `vX.Y.Z-rc.N` (e.g., `v0.1.0-rc.1`)
- Stable releases: `vX.Y.Z` (future — once production deploy exists)

CI runs on every PR and on pushes to `main`. Coverage thresholds are enforced in CI.

---

## 📊 Current Status

**Version:** v1 (Early Development)

The project is in active development with evolving architecture and domain model. Core features are being implemented alongside comprehensive testing infrastructure.

### Recent Milestones

- ✅ Dataset exploration feature (usable)
- ✅ Analysis experience v1 (UI + mock data + explicit states)
- ✅ Testing infrastructure with Vitest + RTL
- ✅ CI pipeline with quality gates
- ✅ Coverage enforcement (50% threshold)
- ✅ Automated PR coverage reporting
- ✅ Git hooks for pre-commit/pre-push checks

---

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`npm test`)
2. Coverage meets minimum threshold (50%)
3. Code follows ESLint rules (`npm run lint`)
4. TypeScript compiles without errors (`npm run typecheck`)
5. Commits follow conventional commit format
6. PRs include relevant documentation updates

---

## 📄 License

[License information to be added]

---

## 🔗 Links

- **Domain Overview:** [docs/DOMAIN.md](docs/DOMAIN.md)
- **Domain Model (ERD + invariants):** [docs/domain/DOMAIN_MODEL.md](docs/domain/DOMAIN_MODEL.md)
