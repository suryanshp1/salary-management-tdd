# AI Prompts & Artifacts

This document captures the AI-assisted development process, including key prompts, design artifacts, and how AI tools were used during development.

## Development Approach

AI tools were used as an **accelerator**, not a replacement for engineering judgment. Every AI-generated output was reviewed, refined, and validated against:
1. Correctness (does it actually work?)
2. Quality (is it production-grade?)
3. Consistency (does it fit the architecture?)

## Key Prompts Used

### Architecture Design
- "Design a clean architecture for a FastAPI salary management app with Repository → Service → Router layers"
- "What's the optimal database schema for an employee salary management system supporting analytics?"

### TDD Workflow
- "Write failing tests for employee CRUD repository operations using pytest with SQLite in-memory"
- "Implement the minimum code to make these tests pass, following Red-Green-Refactor"

### Performance Optimization
- "What's the fastest way to bulk insert 10,000 records into PostgreSQL using SQLAlchemy?"
- "Compare bulk_save_objects vs Core insert() vs COPY for 10k records"

### Frontend Design
- "Design a modern dark-theme dashboard for salary analytics using Recharts"
- "Implement TanStack Query hooks with optimistic updates for CRUD operations"

### Seeding Strategy
- "Generate realistic salary ranges for 15 countries adjusted for cost of living"
- "Create a deterministic seeding script that combines first_names.txt + last_names.txt"

## Design Artifacts

### Entity Relationship Diagram
```
┌──────────────────────────────┐
│          employees           │
├──────────────────────────────┤
│ id          UUID (PK)        │
│ employee_id VARCHAR(10) (UQ) │
│ first_name  VARCHAR(100)     │
│ last_name   VARCHAR(100)     │
│ email       VARCHAR(255) (UQ)│
│ job_title   VARCHAR(150)     │
│ department  VARCHAR(100)     │
│ country     VARCHAR(100)     │
│ city        VARCHAR(100)     │
│ salary      NUMERIC(12,2)    │
│ currency    VARCHAR(3)       │
│ employment_type VARCHAR(20)  │
│ hire_date   DATE             │
│ is_active   BOOLEAN          │
│ created_at  TIMESTAMP        │
│ updated_at  TIMESTAMP        │
└──────────────────────────────┘
         │
    Indexes:
    ├── idx_country
    ├── idx_job_title
    ├── idx_department
    └── idx_country_job (composite)
```

### API Route Map
```
/api/v1/
├── employees/
│   ├── GET    /              # List (paginated, filterable)
│   ├── POST   /              # Create
│   ├── GET    /{id}          # Read
│   ├── PUT    /{id}          # Update
│   └── DELETE /{id}          # Soft delete
├── insights/
│   ├── GET /salary-by-country
│   ├── GET /salary-by-job-title?country=X
│   ├── GET /department-distribution
│   ├── GET /country-distribution
│   ├── GET /salary-ranges
│   ├── GET /summary
│   └── GET /top-earners?limit=N
└── reference/
    ├── GET /countries
    ├── GET /departments
    └── GET /job-titles
```

## Trade-off Decisions

| Decision | Option A | Option B | Chosen | Reason |
|----------|----------|----------|--------|--------|
| DB Driver | asyncpg (async) | psycopg2 (sync) | psycopg2 | Simpler testing, adequate perf |
| Primary Key | Auto-increment | UUID v4 | UUID | Security, distribution-ready |
| Delete Strategy | Hard delete | Soft delete | Soft | HR compliance, audit trail |
| State Mgmt | Redux | TanStack Query | TanStack | Purpose-built for server state |
| Pagination | Client-side | Server-side | Server | 10k records too large for client |
| Styling | Tailwind | Vanilla CSS | Vanilla | Full control, no dependency |

## Performance Considerations

- **Seeding**: Bulk insert via SQLAlchemy Core `insert()` — 10k records in ~2-3s
- **Queries**: Composite indexes on `(country, job_title)` for analytics queries
- **Frontend**: Server-side pagination limits data transfer to ~20 records/request
- **Charts**: Data aggregation done server-side, not client-side
- **Debounce**: Search input debounced at 300ms to limit API calls
