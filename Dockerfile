FROM node:20 AS builder
 
WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install

ENV \
    PORT=8080 \
    HOST=0.0.0.0
 
EXPOSE 8000
CMD pnpm run start
