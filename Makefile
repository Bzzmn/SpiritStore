# Variables
IMAGE_NAME = spiritstore
CONTAINER_NAME = spiritstore
PORT = 8080

.PHONY: build run stop clean

build:
	docker build -t $(IMAGE_NAME) \
		--build-arg VITE_FIREBASE_API_KEY="$$(grep VITE_FIREBASE_API_KEY .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_AUTH_DOMAIN="$$(grep VITE_FIREBASE_AUTH_DOMAIN .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_PROJECT_ID="$$(grep VITE_FIREBASE_PROJECT_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_STORAGE_BUCKET="$$(grep VITE_FIREBASE_STORAGE_BUCKET .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="$$(grep VITE_FIREBASE_MESSAGING_SENDER_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_APP_ID="$$(grep VITE_FIREBASE_APP_ID .env | cut -d '=' -f2)" \
		--build-arg VITE_FIREBASE_MEASUREMENT_ID="$$(grep VITE_FIREBASE_MEASUREMENT_ID .env | cut -d '=' -f2)" \
		.

run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		$(IMAGE_NAME)
	@echo "Application running at http://localhost:$(PORT)"

stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

clean: stop
	docker rmi $(IMAGE_NAME) || true 