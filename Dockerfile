FROM node:10.18.0-jessie

RUN mkdir /app
WORKDIR /app

ADD ./ /app
RUN yarn install

EXPOSE 3900

CMD ["node", "app.js"]