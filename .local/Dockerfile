FROM node:latest

RUN mkdir -p /src/app
WORKDIR /src/app

COPY package*.json /src/app/

COPY prisma /src/app/prisma/

COPY .env /src/app/

RUN npm install

COPY . /src/app

RUN npx prisma generate

EXPOSE 6060

CMD "npm" "run" "local"