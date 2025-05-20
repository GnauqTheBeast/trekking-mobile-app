FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build


FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/proto ./src/proto
RUN npm install -g pnpm
RUN pnpm install --prod
EXPOSE 3001 50058
CMD ["node", "dist/main"]
