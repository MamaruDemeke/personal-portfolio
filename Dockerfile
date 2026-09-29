# ---- Stage 1: build the React client ----
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# ---- Stage 2: install server production dependencies ----
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3: runtime ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=server-build /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist
EXPOSE 8080
WORKDIR /app/server
CMD ["node", "index.js"]
