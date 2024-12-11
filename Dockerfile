FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/api /usr/share/nginx/html/api
COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules
 
EXPOSE 8080
