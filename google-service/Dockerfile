FROM node:alpine

RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["./scripts/wait-for-it.sh", "rabbitmq:5672", "--", "npm", "start"]