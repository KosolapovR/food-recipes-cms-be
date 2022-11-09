FROM node:16-alpine

WORKDIR /usr/app
COPY package.json .

RUN rm -rf ./node_modules
RUN rm -rf ./package-lock.json

RUN apk update && apk add bash
RUN apk --no-cache add curl

RUN npm install

COPY . /usr/app

RUN ["chmod", "+x", "/usr/app/wait-for-it.sh"]

HEALTHCHECK --interval=12s --timeout=12s --start-period=15s \
    CMD curl --fail http://localhost:8080/healthcheck || exit 1
