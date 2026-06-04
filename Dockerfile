FROM node:20-alpine AS builder

WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# copy sources and build
COPY . .
RUN npm run build --silent

FROM node:20-alpine
WORKDIR /app

# production deps only
COPY package.json package-lock.json* ./
RUN npm ci --production --silent

# copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
