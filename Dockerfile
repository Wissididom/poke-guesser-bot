# Stage 1: Build
FROM node:20.3-bookworm-slim as builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
RUN npm ci
RUN npm run build

# Stage 2: Run
FROM node:20.3-bookworm-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/package-lock.json .
COPY --from=builder /usr/src/app/build .
RUN npm ci --omit=dev
CMD [ "npm", "run", "start" ]
