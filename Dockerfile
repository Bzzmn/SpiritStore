# Base stage
FROM nginx:alpine as base

# Add build arguments and make them available as environment variables
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Debug: Print environment variables
RUN echo -e "\e[1;33mBASE STAGE ENVIRONMENT VARIABLES\e[0m"
RUN env

# Create test files for debugging
RUN echo "Nginx is running!" > /usr/share/nginx/html/index.html
RUN echo "Health check endpoint" > /usr/share/nginx/html/health

# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy environment variables as build arguments
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

# Create .env file for Vite
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

# Final stage
FROM base AS final

# Copy nginx configurations
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Debug: Print final contents
RUN echo -e "\e[1;33mCONTENTS OF /usr/share/nginx/html\e[0m"
RUN ls -la /usr/share/nginx/html

# Configure logging
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

# Set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]