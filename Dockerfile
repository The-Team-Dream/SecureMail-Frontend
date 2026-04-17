# STAGE 1: Install all dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# STAGE 2: Build the application
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Static values for build-time (can be overridden by build-args)
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# STAGE 3: Minimal production runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential standalone files produced by next build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is the entrypoint for Next.js standalone mode
CMD ["node", "server.js"]
