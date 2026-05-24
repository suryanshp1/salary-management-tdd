# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
├────────────────────────┬────────────────────────────────────┤
│   React + Vite         │        FastAPI                     │
│   (port 5173)          │        (port 8000)                 │
│                        │                                    │
│  ┌──────────────┐      │  ┌──────────┐  ┌───────────────┐  │
│  │ TanStack     │◄────►│  │ Routers  │──► Services      │  │
│  │ Query        │ REST │  └──────────┘  └───────┬───────┘  │
│  └──────────────┘      │                        │           │
│  ┌──────────────┐      │                 ┌──────▼────────┐  │
│  │ Recharts     │      │                 │ Repositories  │  │
│  │ Dashboard    │      │                 └──────┬────────┘  │
│  └──────────────┘      │                 ┌──────▼────────┐  │
│                        │                 │ SQLAlchemy    │  │
│                        │                 │ + PostgreSQL  │  │
│                        │                 └───────────────┘  │
└────────────────────────┴────────────────────────────────────┘
```

## Backend Architecture (Clean / Layered)

### Layer Responsibilities

| Layer | Purpose | Depends On |
|-------|---------|------------|
| **Router** | HTTP concerns: request parsing, response serialization, status codes | Service |
| **Service** | Business logic: validation, orchestration, error handling | Repository |
| **Repository** | Data access: SQL queries, ORM operations, pagination | Model |
| **Model** | Database schema: table definition, relationships, constraints | None |
| **Schema** | Data transfer: request/response validation, serialization | None |

### Why This Architecture?

1. **Testability**: Each layer can be tested independently by mocking the layer below
2. **Separation of Concerns**: HTTP details don't leak into business logic
3. **Flexibility**: Swap PostgreSQL for any other DB without touching services
4. **Maintainability**: Clear boundaries make code navigation intuitive

### Request Flow

```
HTTP Request
    │
    ▼
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Router  │────►│ Service  │────►│ Repository   │────►│ Database │
│          │     │          │     │              │     │          │
│ Validates│     │ Business │     │ SQL Queries  │     │ PostgreSQL│
│ HTTP     │     │ Rules    │     │ ORM Mapping  │     │          │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘
    │                 │                  │
    ▼                 ▼                  ▼
Pydantic         HTTPException      SQLAlchemy
Schemas          on violations       Session
```

## Frontend Architecture

### Feature-Based Structure

Components, hooks, API calls, and types are **colocated by feature** rather than separated by type:

```
features/
├── employees/          # Everything related to employee management
│   ├── types.ts        # TypeScript interfaces
│   ├── api.ts          # API fetch functions
│   ├── hooks.ts        # TanStack Query hooks
│   ├── EmployeesPage   # Page component
│   ├── EmployeeTable   # Data table
│   └── EmployeeForm    # Create/edit form
└── dashboard/          # Everything related to analytics
    ├── types.ts
    ├── api.ts
    ├── hooks.ts
    ├── DashboardPage
    └── Charts...
```

### State Management Strategy

| State Type | Solution | Rationale |
|------------|----------|-----------|
| Server state | TanStack Query | Caching, refetching, optimistic updates |
| UI state | React useState | Modal open/close, form inputs |
| URL state | React Router | Current page, filters in URL |

No Redux or Zustand needed — TanStack Query handles all server state.

## Database Schema

```sql
CREATE TABLE employees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     VARCHAR(10) UNIQUE NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    job_title       VARCHAR(150) NOT NULL,
    department      VARCHAR(100) NOT NULL,
    country         VARCHAR(100) NOT NULL,
    city            VARCHAR(100),
    salary          NUMERIC(12,2) NOT NULL CHECK (salary > 0),
    currency        VARCHAR(3) NOT NULL DEFAULT 'USD',
    employment_type VARCHAR(20) NOT NULL,
    hire_date       DATE NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_employee_country ON employees(country);
CREATE INDEX idx_employee_job_title ON employees(job_title);
CREATE INDEX idx_employee_department ON employees(department);
CREATE INDEX idx_employee_country_job ON employees(country, job_title);
```

## Seeding Strategy

Performance-critical seed for 10,000 employees:

1. **Pre-compute**: Generate all records in memory from first_names.txt + last_names.txt
2. **Bulk insert**: Use SQLAlchemy `session.execute(insert(Employee), records)` — single round-trip
3. **Single transaction**: One commit for all 10k records
4. **Realistic distribution**: Weighted country/department/salary ranges

Target: **< 5 seconds** for 10,000 records.
