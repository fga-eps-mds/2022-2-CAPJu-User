FROM node:latest

WORKDIR /app

ENV MONGODB_URI=mongodb+srv://capju:capju@cluster0.cum9hpg.mongodb.net/capju?retryWrites=true&w=majority
ENV JWT_SECRET=sad4as84dVFGGRG8asd1a56d1asd1fadfdasfASD

COPY src src
COPY package.json .
RUN yarn cache clean
RUN yarn install --network-timeout 1000000



