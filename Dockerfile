FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM zeabur/caddy-static

COPY --from=builder /app/dist /usr/share/caddy
COPY --from=builder /app/api /usr/share/caddy/api
COPY --from=builder /app/node_modules /usr/share/caddy/node_modules
 
EXPOSE 8080
