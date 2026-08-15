# Multi-stage Dockerfile for Server (Debian Slim with native OpenSSL for Prisma ARM64)
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
