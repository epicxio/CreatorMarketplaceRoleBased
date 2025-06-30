# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app

# ========== Build stage ==========
FROM base AS build

# Install necessary tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY . .

# Install all dependencies including devDependencies
RUN npm ci

# Build using local TypeScript (from node_modules)
RUN npm run build

# ========== Final stage ==========
FROM base

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy only what's needed for production
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/scripts ./src/scripts

EXPOSE 5000

CMD ["npm", "start"]
