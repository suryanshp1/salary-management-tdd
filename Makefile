.PHONY: help setup dev down test test-backend test-frontend seed migrate lint clean logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Build and start all services
	docker compose build
	docker compose up -d
	@echo "Waiting for database..."
	@sleep 3
	docker compose exec backend alembic upgrade head
	@echo "✅ Setup complete. Backend: http://localhost:8000 | Frontend: http://localhost:5173"

dev: ## Start all services in development mode
	docker compose up -d
	@echo "✅ Services started. Backend: http://localhost:8000 | Frontend: http://localhost:5173"

down: ## Stop all services
	docker compose down

test-backend: ## Run backend tests
	cd backend && DATABASE_URL="sqlite:///:memory:" python -m pytest tests/ -v --tb=short

test-frontend: ## Run frontend tests
	cd frontend && npm run test

seed: ## Seed database with 10,000 employees
	docker compose exec backend python -m app.seed.seed
	@echo "✅ Database seeded with 10,000 employees"

migrate: ## Run database migrations
	docker compose exec backend alembic upgrade head

migrate-create: ## Create a new migration (usage: make migrate-create MSG="add users table")
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"

lint: ## Run linters
	cd backend && python -m ruff check app/ tests/
	cd frontend && npm run lint

clean: ## Stop services and remove volumes
	docker compose down -v
	@echo "✅ All services stopped and volumes removed"

logs: ## Follow service logs
	docker compose logs -f

logs-backend: ## Follow backend logs
	docker compose logs -f backend

logs-frontend: ## Follow frontend logs
	docker compose logs -f frontend

db-shell: ## Open PostgreSQL shell
	docker compose exec db psql -U postgres -d salary_mgmt
