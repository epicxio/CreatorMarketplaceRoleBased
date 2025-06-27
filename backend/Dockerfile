# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# ========== Build stage ==========
FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package*.json ./
RUN npm ci

RUN npm install -g typescript

COPY . .
RUN npm run build 

# ========== Final stage ==========
FROM base

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app /app

EXPOSE 5000

CMD [ "npm", "start" ]
