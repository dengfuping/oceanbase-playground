FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

RUN mkdir -p /functions/__umi.func

FROM scratch AS output

COPY --from=builder /app/dist /
COPY --from=builder /app/functions /functions
COPY --from=builder /app/api /functions/__umi.func/api
COPY --from=builder /app/node_modules /functions/__umi.func/node_modules
COPY --from=builder /app/config.json config.json

FROM zeabur/caddy-static

COPY --from=output / /usr/share/caddy
 
EXPOSE 8080
