# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ linux-headers

# Install node-pre-gyp globally for native module compilation
RUN npm install -g node-pre-gyp

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build || npx tsc

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install build dependencies needed for native modules at runtime
RUN apk add --no-cache python3 make g++ linux-headers

# Install node-pre-gyp globally
RUN npm install -g node-pre-gyp

# Copy package files
COPY package*.json ./

# Install production dependencies with build tools available
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/build ./build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the application
CMD ["node", "build/main.js"]
