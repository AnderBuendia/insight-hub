# InsightHub — Domain Definition

## 1) Problem Statement

### Target users
- Knowledge workers (product managers, analysts, and engineering leads) who work with structured data but lack time or technical expertise to perform in-depth analysis.

### Problem
- These users often have access to valuable datasets but struggle to extract actionable insights without relying on complex tools, writing queries, or requesting help from data teams.


### Why it matters
- Slow or inaccessible data analysis leads to delayed decisions, missed opportunities, and over-reliance on specialized roles for simple questions.


### Non-goals (for v1)
- Real user authentication or role-based permissions
- Real-time data ingestion or large-scale datasets
- Advanced data modeling or predictive analytics

## 2) Core Concepts

### User
**Definition:**
- A person who explores datasets and consumes insights to support decision-making.

**Key responsibilities / actions:**
- Select datasets
- Explore metrics
- Ask questions in natural language

**Notes / assumptions:**
- Users are assumed to be authenticated and belong to a single workspace (simplified for v1).


### Dataset
**Definition:**
- A structured collection of data representing a specific business context (e.g., sales, usage, performance).

**Key responsibilities / actions:**
- Provide raw information for analysis
- Serve as the source for metrics and insights

**Notes / assumptions:**
- Datasets are read-only and provided as mock data in v1.


### Metric
Definition:
- A calculated value derived from a dataset that represents a measurable aspect of the data.

Key responsibilities / actions:
- Summarize or aggregate dataset information
- Enable comparison and filtering

Notes / assumptions:
- Metrics are predefined and not user-configurable in v1.

### Insight
**Definition:**
- A meaningful observation derived from metrics that helps users understand patterns or anomalies.

**Key responsibilities / actions:**
- Highlight trends or outliers
- Provide context for decision-making

**Notes / assumptions:**
- Insights may be generated programmatically or assisted by AI.


### AI Query
**Definition:**
- A natural language question submitted by the user to explore a dataset or request insights.

**Key responsibilities / actions:**
- Translate user intent into analytical context
- Return a human-readable explanation or summary

**Notes / assumptions:**
- AI responses are informational and may be imperfect or approximate.

## 3) User Journeys (v1)

### Journey A — Explore a dataset
1. The user selects a dataset relevant to their work.
2. The user reviews key metrics and filters the data.
3. The user identifies notable trends or anomalies.

**Assumptions:**
- At least one dataset is available.

Open questions:
- What should happen when no datasets are available?


### Journey B — Ask AI for insights
1. The user submits a natural language question about a dataset.
2. The system generates an AI-assisted response.
3. The user uses the response to support a decision or hypothesis.

**Assumptions:**
- There is an AI-assisted system

**Open questions:**
- What should happen when AI system fail?
- Can we continue without AI system?

