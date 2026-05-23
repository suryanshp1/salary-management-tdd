.PHONY: help setup dev down test test-backend test-frontend seed migrate lint clean logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## Build and start all services
	docker compose build
	docker compose up -d
	@echo "Waiting for database..."
	@sleep 3
	docker compose exec backend alembic upgrade head
	@echo "✅ Setup complete. Backend: http://localhost:8000"

dev: ## Start all services in development mode
	docker compose up -d
	@echo "✅ Services started. Backend: http://localhost:8000"

down: ## Stop all services
	docker compose down

test-backend: ## Run backend tests
	cd backend && DATABASE_URL="sqlite:///:memory:" python -m pytest tests/ -v --tb=short

migrate: ## Run database migrations
	docker compose exec backend alembic upgrade head

migrate-create: ## Create a new migration (usage: make migrate-create MSG="add users table")
	docker compose exec backend alembic revision --autogenerate -m "$(MSG)"