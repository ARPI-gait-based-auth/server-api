FROM node:10-buster

RUN apt-get update
RUN apt-get install -y python3-pip

RUN pip3 install pandas
RUN pip3 install numpy
RUN pip3 install scipy
RUN pip3 install fastdtw
RUN pip3 install matplotlib

RUN mkdir /app
WORKDIR /app

ADD ./ /app
RUN yarn install

EXPOSE 3900

CMD ["node", "app.js"]
