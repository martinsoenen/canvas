FROM node:19.8.1
WORKDIR "/app"
MAINTAINER martin.soenen@outlook.com

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN npm i npm@latest -g

COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

COPY . /opt/app

CMD ["npm", "start"]

EXPOSE 80