FROM node:10 as builder
MAINTAINER "chevdor@gmail.com"
WORKDIR /polkadot
COPY . .
RUN yarn && \
    yarn build

FROM nginx:alpine
# RUN apk --no-cache add ca-certificates
# WORKDIR /app
COPY --from=builder /polkadot/packages/apps/build /usr/share/nginx/html
# CMD ["./app"]
