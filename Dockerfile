# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Add build arguments
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Create .env file with explicit values
RUN echo "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY:-}" > .env && \
    echo "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN:-}" >> .env && \
    echo "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID:-}" >> .env && \
    echo "VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET:-}" >> .env && \
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID:-}" >> .env && \
    echo "VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID:-}" >> .env

# Debug: Print .env file content without values (for security)
RUN cat .env | sed 's/=.*/=HIDDEN/'

COPY package*.json ./
RUN npm install
COPY . .

# Build the application
RUN npm run build

# Create serve configuration in dist directory
RUN echo '{"rewrites": [{ "source": "/**", "destination": "/index.html" }]}' > dist/serve.json

# Install serve globally
RUN npm install -g serve

EXPOSE 3000

# Use serve with the configuration file
CMD ["serve", "-s", "dist", "-l", "3000"]