FROM --platform=linux/x86_64 node:16-alpine

WORKDIR /usr/server
COPY package.json .

RUN rm -rf ./node_modules
RUN rm -rf ./package-lock.json

RUN apk update && apk add bash
RUN apk --no-cache add curl

RUN npm install

COPY . /usr/server

HEALTHCHECK --interval=12s --timeout=12s --start-period=15s \
    CMD curl --fail http://localhost:8080/healthcheck || exit 1
