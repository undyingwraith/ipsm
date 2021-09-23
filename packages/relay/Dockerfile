FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY ./src ./.

RUN yarn build

ENTRYPOINT ["node", "build/cli.js"]
