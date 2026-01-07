# ===============================
# Stage 1: Dependencies
# ===============================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ===============================
# Stage 2: Builder
# ===============================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/api/src ./apps/api/src
COPY apps/api/drizzle ./apps/api/drizzle

RUN pnpm --filter @keepstash/api build

WORKDIR /app/production
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ===============================
# Stage 3: Production
# ===============================
FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=nodejs:nodejs /app/production/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/production/apps/api/node_modules ./apps/api/node_modules

COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/drizzle ./apps/api/drizzle
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/

# Create startup script that runs migrations then starts the app
RUN echo '#!/bin/sh' > /app/apps/api/start.sh && \
    echo 'set -e' >> /app/apps/api/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/apps/api/start.sh && \
    echo 'node dist/migrate.js' >> /app/apps/api/start.sh && \
    echo 'echo "Migrations complete. Starting API..."' >> /app/apps/api/start.sh && \
    echo 'exec node dist/main.js' >> /app/apps/api/start.sh && \
    chmod +x /app/apps/api/start.sh && \
    chown nodejs:nodejs /app/apps/api/start.sh

USER nodejs

WORKDIR /app/apps/api

EXPOSE 5000

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
  CMD node -e "require('http').get('http://localhost:5000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "start.sh"]