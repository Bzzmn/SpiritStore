# Variables
IMAGE_NAME = spiritstore
CONTAINER_NAME = spiritstore
PORT = 8080

.PHONY: build run stop clean

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):80 \
		--env-file .env \
		$(IMAGE_NAME)
	@echo "Application running at http://localhost:$(PORT)"

stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

clean: stop
	docker rmi $(IMAGE_NAME) || true 