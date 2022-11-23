FROM ubuntu:18.04 as builder

# Install any needed packages
RUN apt-get update && \
  apt-get install --no-install-recommends -y curl git gnupg ca-certificates python3 pkg-config make cmake g++ libudev-dev libusb-1.0-0-dev

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install --no-install-recommends -y nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN npm install yarn -g

WORKDIR /apps
COPY . .

RUN sed -n 's/^\(.*\)=.*$/\1=__\1__/p' .env-example > .env.production.local && \
    echo 'APP_NAME=__APP_NAME__' >> .env.production.local && \
    echo 'RPC_HOSTNAME=__RPC_HOSTNAME__' >> .env.production.local && \
    cat .env.production.local | \
        xargs -I{} bash -c "echo '{}' | sed 's/^\\(.*\\)=.*$/\\1/' >> /srv/env.var.list"

RUN yarn && NODE_ENV=production yarn build:www

# ===========================================================
FROM nginx:stable-alpine

# The following is mainly for doc purpose to show which ENV is supported
ENV WS_URL=

WORKDIR /usr/share/nginx/html

COPY env.sh .

RUN apk add --no-cache bash; chmod +x env.sh

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /apps/packages/apps/build /usr/share/nginx/html
COPY --from=builder /srv/env.var.list /srv/env.var.list
COPY --chown=root:root deploy/replace-env-var-placeholders.sh /usr/local/bin/replace-env-var-placeholders.sh

ENV APP_NAME=APP_NAME_NOT_SET
ENV RPC_HOSTNAME=RPC_HOSTNAME_NOT_SET
ENV WS_URL=WS_URL_NOT_SET
ENV POLKADOT_UI_SAMPLE=POLKADOT_UI_SAMPLE_NOT_SET

EXPOSE 80

CMD replace-env-var-placeholders.sh && \
    /usr/share/nginx/html/env.sh && \
    nginx -g 'daemon off;'
