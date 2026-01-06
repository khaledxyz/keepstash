# ===============================
# Stage 1: Dependencies
# ===============================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ts-sdk/package.json ./packages/ts-sdk/

COPY packages/ts-sdk/openapi-ts.config.ts ./packages/ts-sdk/
COPY packages/ts-sdk ./packages/ts-sdk
COPY apps/api/openapi.json ./apps/api/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @keepstash/ts-sdk generate

# ===============================
# Stage 2: Builder
# ===============================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ts-sdk ./packages/ts-sdk

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/

COPY apps/web/tsconfig*.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/
COPY apps/web/index.html ./apps/web/
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public

RUN pnpm --filter @keepstash/web build

# ===============================
# Stage 3: Production
# ===============================
FROM caddy:2-alpine AS production

RUN apk add --no-cache nodejs dumb-init

RUN addgroup -g 1001 -S caddyuser && \
    adduser -S caddyuser -u 1001

WORKDIR /srv

COPY --from=builder --chown=caddyuser:caddyuser /app/apps/web/dist ./dist

COPY --chown=caddyuser:caddyuser apps/web/env.sh ./env.sh
RUN chmod +x ./env.sh

COPY apps/web/Caddyfile /etc/caddy/Caddyfile

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo 'cd /srv' >> /entrypoint.sh && \
    echo './env.sh' >> /entrypoint.sh && \
    echo 'exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh && \
    chown caddyuser:caddyuser /entrypoint.sh

USER caddyuser

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["/entrypoint.sh"]