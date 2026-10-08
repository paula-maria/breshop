# Stage 1: build do frontend (API no mesmo host, via /api)
FROM node:20-slim AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npx vite build

# Stage 2: build do backend
FROM node:20-slim AS backend
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate && npm run build

# Stage 3: imagem final com backend + frontend
FROM node:20-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production PORT=3333
COPY --from=backend /app ./
COPY --from=frontend /frontend/dist ./public
RUN mkdir -p uploads
EXPOSE 3333
CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$SEED_ON_START\" = \"true\" ]; then npx prisma db seed; fi && node dist/server.js"]
