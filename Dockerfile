FROM public.ecr.aws/docker/library/node:latest

RUN mkdir -p /src/app

WORKDIR /src/app

COPY package*.json /src/app/

COPY prisma /app/prisma/

RUN npm install

RUN printenv > .env.local

COPY . /src/app

RUN npm run build

EXPOSE 80