# cennznet/ui

## Get started

- run `docker pull cenznet/cennznet:1.0.0-rc2` and `docker pull cennznet/ui:latest`;
- run `docker run -p 9944:9944 -p 9933:9933 cenznet/cennznet:1.0.0-rc2 --dev --unsafe-ws-external --unsafe-rpc-external`;
- run `docker run --rm -it --name cennznet-ui -p 3000:80 cennznet/ui:latest`;
- browse `localhost:3000`;
