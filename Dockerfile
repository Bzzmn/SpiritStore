# syntax=docker/dockerfile:1.4
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for build-time configuration
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

# Build the application
RUN npm run build

# Stage 2: Prepare nginx
FROM nginx:alpine

# Copy the built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
COPY env.js /usr/share/nginx/html/env.js

# Add script to replace environment variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-config.sh && \
    echo 'envsubst < /usr/share/nginx/html/env.js > /usr/share/nginx/html/env.js.tmp && \
    mv /usr/share/nginx/html/env.js.tmp /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env-config.sh && \
    chmod +x /docker-entrypoint.d/40-env-config.sh

# Add nginx configuration for React Router with security headers
RUN echo ' \
    server { \
    listen 80; \
    server_tokens off; \
    add_header X-Frame-Options "SAMEORIGIN"; \
    add_header X-XSS-Protection "1; mode=block"; \
    add_header X-Content-Type-Options "nosniff"; \
    add_header Referrer-Policy "strict-origin-when-cross-origin"; \
    add_header Content-Security-Policy "default-src '\''self'\''; connect-src '\''self'\'' https://*.firebaseio.com https://*.googleapis.com; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data: https:; font-src '\''self'\'' data:;"; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    add_header Cache-Control "no-store, no-cache, must-revalidate"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 