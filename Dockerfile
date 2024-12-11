FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM zeabur/caddy-static

COPY --from=builder /app/dist /usr/share/caddy
 
EXPOSE 8080
