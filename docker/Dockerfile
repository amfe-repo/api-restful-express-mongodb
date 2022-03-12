FROM node:16-alpine3.14

WORKDIR /app

COPY ../ .

ENV WORK_ENV=production

RUN npm i

EXPOSE 8080

CMD ["node","server.js"]