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

# Debug: Print environment check (values will be hidden)
RUN echo "Checking environment variables:" && \
    echo "VITE_FIREBASE_API_KEY: ${VITE_FIREBASE_API_KEY:+SET}" && \
    echo "VITE_FIREBASE_PROJECT_ID: ${VITE_FIREBASE_PROJECT_ID:+SET}" && \
    echo "VITE_FIREBASE_AUTH_DOMAIN: ${VITE_FIREBASE_AUTH_DOMAIN:+SET}"

# Create .env file with explicit values
RUN echo "VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY:-}" > .env && \
    echo "VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN:-}" >> .env && \
    echo "VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID:-}" >> .env && \
    echo "VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET:-}" >> .env && \
    echo "VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID:-}" >> .env && \
    echo "VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID:-}" >> .env

# Debug: Print .env file (without values)
RUN echo "Content of .env file:" && \
    cat .env | sed 's/=.*$/=HIDDEN/'

COPY package*.json ./
RUN npm install
COPY . .

# Build the application
RUN npm run build

# Create a more detailed serve configuration
RUN echo '{ \
    "public": "dist", \
    "rewrites": [ \
    { "source": "/**", "destination": "/index.html" } \
    ], \
    "headers": [ \
    { \
    "source": "/**", \
    "headers": [ \
    { "key": "Cache-Control", "value": "no-cache" }, \
    { "key": "X-Frame-Options", "value": "DENY" } \
    ] \
    } \
    ] \
    }' > serve.json

# Install serve globally
RUN npm install -g serve

# Set environment variable for internal port
ENV PORT=3000

# Expose internal port
EXPOSE 3000

# Health check on internal port
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Use serve with explicit configuration
CMD ["sh", "-c", "serve -s dist --listen 3000 --no-clipboard --no-port-switching"]