FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8000

CMD ["yarn", "serve:development"]
