FROM node:10

WORKDIR /usr/app
COPY package.json .

RUN npm install


COPY . /usr/app

RUN ["chmod", "+x", "/usr/app/wait-for-it.sh"]



