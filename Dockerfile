FROM --platform=linux/x86_64 node:16-alpine

WORKDIR /usr/server
COPY package.json .

RUN rm -rf ./node_modules
RUN rm -rf ./package-lock.json

RUN apk update && apk --no-cache add bash curl coreutils

RUN npm install pm2 -g
RUN npm install
RUN npm run postinstall

COPY . /usr/server
#RUN npm run migrate
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s \
    CMD curl --fail http://localhost:8080/healthcheck || exit 1

CMD pm2-runtime ./src/index.ts