FROM node:20-alpine AS builder

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# copy sources and build
COPY . .
RUN npm run build --silent

FROM node:20-alpine AS runner
WORKDIR /app

# production deps only
COPY package.json package-lock.json* ./
RUN npm ci --production --silent

# copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main"]
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
