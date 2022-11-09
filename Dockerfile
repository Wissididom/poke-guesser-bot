FROM node:19
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD [ "npm", "start" ]
