FROM node:20.3-bookworm-slim
WORKDIR /usr/src/app
COPY . .
RUN npm i -g typescript
RUN npm i
RUN tsc
RUN cp -r /usr/src/app/build/. .
RUN rm *.ts
CMD [ "npm", "start" ]
