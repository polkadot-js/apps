FROM ubuntu:18.04 as builder

# Install any needed packages
RUN apt-get update && apt-get install -y curl git gnupg

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

WORKDIR /apps
COPY . .

RUN npm install yarn -g
RUN yarn
RUN NODE_ENV=production yarn build:www

FROM ubuntu:18.04

RUN apt-get update && apt-get -y install nginx

COPY --from=builder /apps/packages/apps/build /var/www/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
