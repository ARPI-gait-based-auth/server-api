FROM node:10-buster

ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get install -y python3-pip tree

RUN pip3 install pandas
RUN pip3 install numpy
RUN pip3 install scipy
RUN pip3 install fastdtw
RUN pip3 install sklearn
RUN pip3 install matplotlib

RUN mkdir /app
WORKDIR /app

ADD ./ /app
RUN yarn install

EXPOSE 3900

# RUN tree --du -h ./data
# RUN node test.js
# RUN tree --du -h ./data
# RUN node test2.js
# RUN tree --du -h ./data


CMD ["node", "app.js"]
