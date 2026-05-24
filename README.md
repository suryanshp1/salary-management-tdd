# Salary Management Tool

A production-grade salary management platform for HR managers, built to manage 10,000+ employees with rich analytics and insights.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Features

### Employee Management
- **CRUD Operations**: Add, view, update, and soft-delete employees
- **Advanced Search**: Filter by name, email, employee ID
- **Multi-filter**: Filter by country, department, job title
- **Sortable Columns**: Sort by any column (asc/desc)
- **Pagination**: Server-side pagination with configurable page sizes

### Salary Insights Dashboard
- **Summary Cards**: Total employees, average salary, total payroll, active countries
- **Salary by Country**: Min/max/avg/median salary per country
- **Salary by Job Title**: Average salary for job titles within a country
- **Department Distribution**: Employee count per department
- **Salary Range Distribution**: Histogram of salary brackets
- **Top Earners**: Highest-paid employees across the organization

### Technical Highlights
- **TDD**: Built with Test-Driven Development (Red → Green → Refactor)
- **Clean Architecture**: Router → Service → Repository → Model layers
- **Bulk Seeding**: 10,000 employees seeded in < 5 seconds
- **Type Safety**: Full TypeScript on frontend, type hints on backend
- **Docker**: One-command setup with Docker Compose

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0, PostgreSQL 16 |
| **Frontend** | React 18, TypeScript 5.6, Vite 6, TanStack Query 5 |
| **Charts** | Recharts 2.13 |
| **Database** | PostgreSQL 16 with Alembic migrations |
| **Infrastructure** | Docker Compose, Makefile, GitHub Actions CI |
| **Testing** | Pytest (backend), Vitest (frontend) |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Make (optional, for convenience commands)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/salary-management.git
cd salary-management

# Start all services (PostgreSQL + Backend + Frontend)
make setup

# Seed the database with 10,000 employees
make seed
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Without Docker

```bash
# Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Set DATABASE_URL environment variable
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Running Tests

```bash
# All tests
make test

# Backend only
make test-backend

# Frontend only
make test-frontend
```

## Project Structure

```
salary-management/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── config.py         # Settings management
│   │   ├── database.py       # Database connection
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── repositories/     # Data access layer
│   │   ├── services/         # Business logic layer
│   │   ├── routers/          # API endpoints
│   │   └── seed/             # Database seeding
│   ├── tests/                # Backend tests
│   ├── alembic/              # Database migrations
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── features/         # Feature modules
│   │   │   ├── employees/    # Employee CRUD
│   │   │   └── dashboard/    # Analytics dashboard
│   │   ├── components/       # Shared components
│   │   └── hooks/            # Custom hooks
│   └── Dockerfile
├── docker-compose.yml
├── Makefile
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_DECISIONS.md
│   └── AI_PROMPTS.md
└── .github/workflows/ci.yml
```

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive Swagger documentation.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/employees` | List employees (paginated) |
| POST | `/api/v1/employees` | Create employee |
| GET | `/api/v1/employees/{id}` | Get employee |
| PUT | `/api/v1/employees/{id}` | Update employee |
| DELETE | `/api/v1/employees/{id}` | Soft-delete employee |
| GET | `/api/v1/insights/salary-by-country` | Salary stats per country |
| GET | `/api/v1/insights/summary` | Organization summary |

## Development Approach

This project was built using **Test-Driven Development (TDD)**:

1. **Red**: Write a failing test for the desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code quality while keeping tests green

Each commit in the history demonstrates this cycle. View the commit history to see the evolution of the codebase.

## License

MIT
