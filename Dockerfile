FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
 
EXPOSE 8000
CMD ["timeout", "60s", "pnpm", "start"]
