FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

COPY dist output

RUN mkdir -p output/functions/__umi.func
COPY api output/functions/__umi.func/api
COPY node_modules output/functions/__umi.func/node_modules
RUN mv zbpack.json output/config.json

FROM zeabur/caddy-static

COPY --from=builder /app/output /usr/share/caddy
 
EXPOSE 8080
