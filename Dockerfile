# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Add build arguments
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Debug: Print environment variables
RUN echo "Checking build arguments:"
RUN echo "VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY:+is set}"
RUN echo "VITE_FIREBASE_PROJECT_ID: ${VITE_FIREBASE_PROJECT_ID:+is set}"

# Create .env file
RUN echo "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}" > .env && \
    echo "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}" >> .env && \
    echo "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}" >> .env && \
    echo "VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}" >> .env && \
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}" >> .env && \
    echo "VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}" >> .env

# Debug: Show .env contents (mask sensitive data)
RUN cat .env | sed 's/=.*$/=MASKED/'

# Build the application
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Debug: Show dist contents
RUN ls -la dist

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Set environment variable for port
ENV PORT=3000

# Expose port more explicitly
EXPOSE 3000/tcp

# Add Traefik labels with improved configuration
LABEL traefik.enable="true"
LABEL traefik.docker.network="coolify"
LABEL traefik.http.services.spirit-store-service.loadbalancer.server.port="3000"
LABEL traefik.http.routers.spirit-store.rule="Host(`spiritstore.thefullstack.digital`)"
LABEL traefik.http.routers.spirit-store.service="spirit-store-service"
LABEL traefik.http.routers.spirit-store.entrypoints="websecure"
LABEL traefik.http.routers.spirit-store.tls="true"
LABEL traefik.http.routers.spirit-store.tls.certresolver="letsencrypt"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Health check with more generous timing
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start serve with specific host and port
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3000"]