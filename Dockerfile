FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV APP_URL=http://localhost:3000
ENV AUTH_SECRET=non-secret-build-placeholder-at-least-32-characters
ENV S3_ENDPOINT=http://localhost:9000
ENV S3_REGION=us-east-1
ENV S3_BUCKET=portfoliocms
ENV S3_ACCESS_KEY_ID=build
ENV S3_SECRET_ACCESS_KEY=non-secret-build-placeholder
ENV S3_FORCE_PATH_STYLE=true
ENV MAX_UPLOAD_SIZE_MB=10
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
