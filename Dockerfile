FROM node:20-alpine AS builder
WORKDIR /app

# Build tools needed for better-sqlite3
RUN apk add --no-cache python3 make g++

COPY package*.json ./
# --include=dev ensures devDependencies are installed regardless of NODE_ENV
RUN npm ci --include=dev

COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache sqlite

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p ./public

# Copy seed data
COPY --from=builder /app/data ./data-seed

COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Ensure /data is owned by nextjs before volume mount
RUN mkdir -p /data && chown nextjs:nodejs /data
VOLUME ["/data"]

EXPOSE 3000

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DB_PATH=/data/home.db

ENTRYPOINT ["/entrypoint.sh"]
