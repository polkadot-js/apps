FROM node:alpine

ENV NODE_ENV=production
ENV WS_URL=ws://localhost:9944

WORKDIR /apps
COPY . .

RUN yarn && yarn cache clean

EXPOSE 80

CMD ["yarn", "start"]
