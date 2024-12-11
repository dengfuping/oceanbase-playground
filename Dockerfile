FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

COPY /app/dist /app/output

RUN /app/mkdir -p /app/output/functions/__umi.func
COPY /app/api /app/output/functions/__umi.func/api
COPY /app/node_modules /app/output/functions/__umi.func/node_modules
RUN mv /app/zbpack.json /app/output/config.json

FROM zeabur/caddy-static

COPY --from=builder /app/output /usr/share/caddy
 
EXPOSE 8080
