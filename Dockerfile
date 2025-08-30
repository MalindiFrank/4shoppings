# Use Node.js 20 Alpine as base image for smaller size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5173 3001
CMD ["npm", "run", "dev:full"]

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy database file for JSON server (if needed)
COPY db.json /usr/share/nginx/html/

# Install Node.js for JSON server in production
RUN apk add --no-cache nodejs npm
RUN npm install -g json-server

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'json-server --watch /usr/share/nginx/html/db.json --port 3001 --host 0.0.0.0 &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 3001

CMD ["/start.sh"]
