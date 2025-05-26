# Base image
FROM node:18-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time arguments
ARG NEXT_PUBLIC_STEADFAST_API_ID
ARG NEXT_PUBLIC_STEADFAST_SECRET_KEY

# Set them as env vars so Next.js sees them during build
ENV NEXT_PUBLIC_STEADFAST_API_ID=$NEXT_PUBLIC_STEADFAST_API_ID
ENV NEXT_PUBLIC_STEADFAST_SECRET_KEY=$NEXT_PUBLIC_STEADFAST_SECRET_KEY

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]