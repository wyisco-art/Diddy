# Backend Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY server/tsconfig.json ./
COPY server/src ./src

# Build
RUN npm install -D typescript @types/node
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./

EXPOSE 3001

CMD ["npm", "start"]
