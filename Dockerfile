FROM node:18.9.0-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD [ "npm", "start" ]
