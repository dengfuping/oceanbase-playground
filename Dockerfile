FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run dev

ENV \
    PORT=8080 \
    HOST=0.0.0.0
 
EXPOSE 8080
