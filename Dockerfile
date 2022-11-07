FROM node:10-alpine

WORKDIR /usr/app
COPY package.json .

RUN apk update && apk add bash

RUN npm install


COPY . /usr/app

RUN ["chmod", "+x", "/usr/app/wait-for-it.sh"]



