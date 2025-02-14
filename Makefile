# Variables
VITE = ./node_modules/.bin/vite
NPM = npm

# Default target
.DEFAULT_GOAL := help

# Colors
CYAN = \033[0;36m
NC = \033[0m # No Color

# Help
.PHONY: help
help:
	@echo "$(CYAN)Available commands:$(NC)"
	@echo "$(CYAN)make install$(NC)    - Install dependencies"
	@echo "$(CYAN)make dev$(NC)        - Start development server"
	@echo "$(CYAN)make build$(NC)      - Build for production"
	@echo "$(CYAN)make preview$(NC)    - Preview production build"
	@echo "$(CYAN)make clean$(NC)      - Clean build directory"
	@echo "$(CYAN)make lint$(NC)       - Run ESLint"
	@echo "$(CYAN)make update$(NC)     - Update dependencies"
	@echo "$(CYAN)make docker-build$(NC) - Build Docker image"
	@echo "$(CYAN)make docker-run$(NC)   - Run Docker container"
	@echo "$(CYAN)make docker-stop$(NC)  - Stop Docker container"

# Install dependencies
.PHONY: install
install:
	$(NPM) install

# Start development server
.PHONY: dev
dev:
	$(NPM) run dev

# Build for production
.PHONY: build
build:
	$(NPM) run build

# Preview production build
.PHONY: preview
preview:
	$(NPM) run preview

# Clean build directory
.PHONY: clean
clean:
	rm -rf dist
	rm -rf node_modules

# Lint code
.PHONY: lint
lint:
	$(NPM) run lint

# Update dependencies
.PHONY: update
update:
	$(NPM) update

# Docker commands
.PHONY: docker-build docker-run docker-stop docker-clean docker-rebuild

# Load environment variables from .env file
include .env
export

docker-build:
	docker build --no-cache \
		--build-arg VITE_FIREBASE_API_KEY="$(VITE_FIREBASE_API_KEY)" \
		--build-arg VITE_FIREBASE_AUTH_DOMAIN="$(VITE_FIREBASE_AUTH_DOMAIN)" \
		--build-arg VITE_FIREBASE_PROJECT_ID="$(VITE_FIREBASE_PROJECT_ID)" \
		--build-arg VITE_FIREBASE_STORAGE_BUCKET="$(VITE_FIREBASE_STORAGE_BUCKET)" \
		--build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="$(VITE_FIREBASE_MESSAGING_SENDER_ID)" \
		--build-arg VITE_FIREBASE_APP_ID="$(VITE_FIREBASE_APP_ID)" \
		-t spirit-store .

docker-run:
	docker run -p 3000:80 \
		--env-file .env \
		spirit-store

docker-stop:
	docker stop $$(docker ps -q --filter ancestor=spirit-store) || true

docker-clean:
	docker stop $$(docker ps -a -q --filter ancestor=spirit-store) || true
	docker rm $$(docker ps -a -q --filter ancestor=spirit-store) || true
	docker rmi spirit-store || true

docker-rebuild: docker-clean docker-build docker-run

# Si el contenedor anterior sigue corriendo, agregar este comando
.PHONY: docker-run-dev
docker-run-dev:
	docker run -p 3000:3000 \
		--env-file .env \
		spirit-store

# Para debugging
.PHONY: docker-run-debug
docker-run-debug:
	docker run -p 3000:3000 \
		-e VITE_FIREBASE_API_KEY="${VITE_FIREBASE_API_KEY}" \
		-e VITE_FIREBASE_AUTH_DOMAIN="${VITE_FIREBASE_AUTH_DOMAIN}" \
		-e VITE_FIREBASE_PROJECT_ID="${VITE_FIREBASE_PROJECT_ID}" \
		-e VITE_FIREBASE_STORAGE_BUCKET="${VITE_FIREBASE_STORAGE_BUCKET}" \
		-e VITE_FIREBASE_MESSAGING_SENDER_ID="${VITE_FIREBASE_MESSAGING_SENDER_ID}" \
		-e VITE_FIREBASE_APP_ID="${VITE_FIREBASE_APP_ID}" \
		-e DEBUG=true \
		spirit-store

# All: clean install and build
.PHONY: all
all: clean install build 