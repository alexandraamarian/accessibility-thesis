FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN npm ci

# Build frontend
COPY frontend/ frontend/
RUN npm run build --workspace=frontend

# Build backend
COPY backend/ backend/
COPY tsconfig.base.json ./
RUN npm run build --workspace=backend

# Production image
FROM node:18-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
RUN npm ci --workspace=backend --omit=dev

COPY --from=base /app/backend/dist backend/dist
COPY --from=base /app/frontend/dist frontend/dist

EXPOSE 3000
CMD ["node", "backend/dist/main.js"]
