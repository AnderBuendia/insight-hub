# <Project Name> — Architecture Overview

> This document describes the high-level architecture of the system.
> It focuses on intent, boundaries, and decision criteria rather than implementation details.
>
> The goal is to enable consistent decision-making as the system evolves.
> Architecture describes intent and boundaries, not implementation.
> If a decision explains why, it belongs in an ADR.

---

## 1) Architectural Goals (vX)

Purpose: provide a decision-making compass for future work.

### What to define here
- Architectural qualities you want to protect (clarity, isolation, scalability, etc.).
- Constraints you consciously accept.
- Principles that guide future decisions.

### What NOT to define here
- Folder names
- Libraries or frameworks
- Implementation details

## 1) Architectural Goals (v1)
- 
- 
- 

### Architectural Non-goals (v1)
- 
- 

## 2) Layering & Responsibilities

Purpose: answer “where should this logic live?”

### What to define here
- System layers
- Responsibilities of each layer
- Explicit “must not” rules

### What NOT to define here
- Concrete APIs
- Implementation specifics

### `src/domain/`
**Purpose:**  
**Must not:**  

### `src/infra/`
**Purpose:**  
**Must not:**  

### `src/features/`
**Purpose:**  
**Owns:**  
**Must not:**  

### `src/shared/`
**Purpose:**  
**Must not:**  

### `src/app/`
**Purpose:**  

## 2.1) Dependency Rules

Purpose: prevent architectural erosion over time.

### What to define here
- Explicit import rules
- Allowed and forbidden dependencies

- 
- 
- 


## 3) Feature Modules (v1)

Purpose: keep features cohesive and predictable as the codebase grows.

## What to define here
- Feature boundaries
- State ownership
- Responsibilities per feature

## What NOT to define here
- UI layout
- Component hierarchies

### `features/<feature-name>`
**Responsibilities:**  
- 

**Owns:**  
- 

**Must not:**  
- 

## 4) Domain Layer

Purpose: protect the most valuable and stable part of the system.

## What to define here
- Core business concepts
- Business invariants
- Where domain rules live (types, factories, pure functions)

## What NOT to define here
- Persistence or networking details
- UI behavior

### Domain models
- 

### Domain boundaries
- 

### Invariants
- 

## 5) Data Flow

Purpose: make the system understandable and debuggable.

## What to define here
- High-level data movement
- Responsibility transitions
- Direction of flow

## What NOT to define here
- Exact function signatures
- Framework-specific hooks

### <Main flow name>
1. 
2. 
3. 

## 5.1) Infra Contracts (vX)

Purpose: decouple features from implementation details.

## What to define here
- Conceptual interfaces exposed by infrastructure
- Expected inputs and outputs

## What NOT to define here
- Protocol-level or low-level details

## 5.1 Infra Contracts (v1)
- 
- 

## 6) System States (vX)

Purpose: design for real-world failures, not ideal paths.

## What to define here
- Non-happy-path scenarios
- Degraded behavior
- Retry and recovery rules

## What NOT to define here
- Pixel-perfect UI
- Copywriting details

### <State name>
- Expected behavior:
- UX notes:

## 7) Decisions & Trade-offs

Purpose: make architectural reasoning explicit and defensible.

## What to define here
- Conscious architectural decisions
- Trade-offs and accepted consequences

## What NOT to define here
- Every micro-decision
- Historical debates (those belong in ADRs)

- Decision:
  - Consequence:
