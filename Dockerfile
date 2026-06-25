# =============================================================================
# Dopamine-UI Multi-Stage Dockerfile
# =============================================================================
# INTENT: Create a minimal production image for Next.js 15 with standalone output.
# Uses 3 stages for optimal layer caching and reduced image size.
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# INTENT: Isolate dependency installation for better Docker layer caching.
# When code changes but package*.json doesn't, this layer is cached.
# -----------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Install build dependencies for native npm packages (node-gyp)
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

# Copy only files needed for npm ci
COPY package.json package-lock.json ./

# npm ci ensures exact match with lock file (unlike npm install)
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 2: Builder
# INTENT: Compile Next.js application with standalone output.
# standalone = minimal set of files to run without node_modules
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments for environment variables embedded in client code
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build production bundle (without turbopack for standalone compatibility)
RUN npx next build

# -----------------------------------------------------------------------------
# Stage 3: Runner (Production)
# INTENT: Minimal image with only necessary files for runtime.
# Non-root user for security (principle of least privilege).
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
# INTENT: Container should NOT run as root - this is a security best practice
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static files (public assets)
COPY --from=builder /app/public ./public

# Copy standalone bundle with correct ownership
# standalone contains server.js and minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Next.js standalone listens on port 3000 by default
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run standalone server
CMD ["node", "server.js"]
