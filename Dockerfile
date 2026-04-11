# Build from monorepo root (uses full .next + node_modules — works on Windows hosts and Linux CI):
#   docker build -f SecureMail-Frontend/Dockerfile -t securemail-frontend \
#     --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000 .

FROM node:20-bookworm-slim AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY SecureMail-Frontend/package.json SecureMail-Frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY SecureMail-Frontend .

ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

FROM node:20-bookworm-slim AS runner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/public ./public
COPY --from=deps /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["pnpm", "exec", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
