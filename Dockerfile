FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
 
EXPOSE 8000
ENTRYPOINT ["timeout", "3600", "pnpm", "start"]
