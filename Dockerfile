FROM node:20-alpine AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM node:20-alpine AS server-deps

WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app/server

COPY --from=server-deps /app/server/node_modules ./node_modules
COPY server/package*.json ./
COPY server/src ./src
COPY --from=client-build /app/client/dist /app/client/dist

EXPOSE 3001

CMD ["npm", "start"]
