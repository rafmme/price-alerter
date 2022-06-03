FROM node:14-alpine

LABEL maintainer="Timileyin Farayola: timileyin.farayola@gmail.com"

ENV NODE_ENV="production"

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install
RUN npm run transpile

CMD ["npm", "start"]
