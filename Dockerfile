FROM node:10.15.3-stretch
ARG NODE_ENV=production

RUN apt update && apt install -y zip

WORKDIR /app
COPY . .

RUN yarn install

RUN yarn run build:${NODE_ENV}

RUN zip -r build.zip build
