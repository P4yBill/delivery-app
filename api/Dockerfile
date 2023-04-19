# Build environment
# ----------------------
FROM node:14-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json

RUN yarn
COPY ./src ./src
COPY ./index.ts ./index.ts

RUN yarn build


# Deployment environment
# ----------------------
FROM node:14-alpine
WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install:prod

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080

CMD yarn start