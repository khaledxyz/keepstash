# ===============================
# Stage 1: Dependencies
# ===============================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

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

RUN pnpm --filter @keepstash/api build

WORKDIR /app/production
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --prod

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
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/

USER nodejs

WORKDIR /app/apps/api

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]