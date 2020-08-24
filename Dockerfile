FROM node:alpine

ENV HOME=/home/app/medtech
WORKDIR ${HOME}

COPY package*.json ./

RUN yarn

VOLUME ${HOME}/node_modules

COPY . .
EXPOSE 3050

CMD ["yarn", "start"]