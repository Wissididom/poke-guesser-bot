FROM node:19
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./languages/. ./languages/.
COPY build/. .
RUN npm install
CMD [ "npm", "start" ]
