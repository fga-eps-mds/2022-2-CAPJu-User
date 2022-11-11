FROM node:14.21.1-bullseye-slim

WORKDIR /app


COPY src src
COPY package.json .
RUN yarn cache clean
RUN yarn install --network-timeout 1000000



