# Variables
IMAGE_NAME = spiritstore
CONTAINER_NAME = spiritstore
PORT = 8080

# Colores para los mensajes
CYAN = \033[0;36m
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[1;33m
RESET = \033[0m

.PHONY: help build run stop clean logs shell status ports

# Objetivo por defecto
help:
	@echo "$(CYAN)Comandos disponibles:$(RESET)"
	@echo "  $(GREEN)make build$(RESET)   - Construye la imagen Docker"
	@echo "  $(GREEN)make run$(RESET)     - Ejecuta el contenedor"
	@echo "  $(GREEN)make stop$(RESET)    - Detiene el contenedor"
	@echo "  $(GREEN)make clean$(RESET)   - Elimina el contenedor e imagen"
	@echo "  $(GREEN)make logs$(RESET)    - Muestra los logs del contenedor"
	@echo "  $(GREEN)make shell$(RESET)   - Abre una shell en el contenedor"
	@echo "  $(GREEN)make status$(RESET)  - Muestra el estado de los contenedores"
	@echo "  $(GREEN)make ports$(RESET)   - Muestra los puertos en uso"

# Construir la imagen
build:
	@echo "$(CYAN)Construyendo imagen Docker...$(RESET)"
	docker build -t $(IMAGE_NAME) \
		--build-arg VITE_FIREBASE_API_KEY="$$(grep VITE_FIREBASE_API_KEY .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_AUTH_DOMAIN="$$(grep VITE_FIREBASE_AUTH_DOMAIN .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_PROJECT_ID="$$(grep VITE_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_STORAGE_BUCKET="$$(grep VITE_FIREBASE_STORAGE_BUCKET .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="$$(grep VITE_FIREBASE_MESSAGING_SENDER_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_APP_ID="$$(grep VITE_FIREBASE_APP_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_MEASUREMENT_ID="$$(grep VITE_FIREBASE_MEASUREMENT_ID .env | cut -d '=' -f2)" \
		.

# Verificar puerto antes de ejecutar
check-port:
	@if lsof -Pi :$(PORT) -sTCP:LISTEN -t >/dev/null ; then \
		echo "$(RED)Error: El puerto $(PORT) ya está en uso.$(RESET)" ; \
		echo "$(YELLOW)Puedes:$(RESET)" ; \
		echo "1. Usar un puerto diferente: PORT=<nuevo_puerto> make run" ; \
		echo "2. Verificar qué está usando el puerto: make ports" ; \
		echo "3. Detener otros contenedores: make stop" ; \
		exit 1 ; \
	fi

# Ejecutar el contenedor
run: check-port
	@echo "$(CYAN)Iniciando contenedor...$(RESET)"
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		$(IMAGE_NAME)
	@echo "$(GREEN)Aplicación disponible en http://localhost:$(PORT)$(RESET)"

# Detener el contenedor
stop:
	@echo "$(CYAN)Deteniendo contenedor...$(RESET)"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Limpiar contenedor e imagen
clean: stop
	@echo "$(CYAN)Eliminando imagen...$(RESET)"
	docker rmi $(IMAGE_NAME) || true

# Ver logs del contenedor
logs:
	@echo "$(CYAN)Mostrando logs...$(RESET)"
	docker logs -f $(CONTAINER_NAME)

# Abrir shell en el contenedor
shell:
	@echo "$(CYAN)Abriendo shell en el contenedor...$(RESET)"
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Mostrar estado de los contenedores
status:
	@echo "$(CYAN)Estado de los contenedores:$(RESET)"
	docker ps -a

# Mostrar puertos en uso
ports:
	@echo "$(CYAN)Puertos en uso:$(RESET)"
	@echo "$(YELLOW)Procesos usando el puerto $(PORT):$(RESET)"
	@lsof -i :$(PORT) || echo "$(GREEN)El puerto $(PORT) está libre$(RESET)" 