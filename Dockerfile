FROM node:14

WORKDIR /usr/app
COPY package.json .

RUN npm install


COPY . /usr/app

RUN ["chmod", "+x", "/usr/app/wait-for-it.sh"]

#RUN npm run migrate
#RUN npm run build


