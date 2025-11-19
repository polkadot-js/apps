# Selendra Portal

A Portal into the Selendra Network. Provides a view and interaction layer from a browser.

## Credits

This project is based on [polkadot-js/apps](https://github.com/polkadot-js/apps) - the official Polkadot/Substrate Portal. We thank the Polkadot.js team for their excellent work.

## Development

To get started:

1. Clone the repo: `git clone https://github.com/selendra/selendra-portal`
2. Ensure you have [Node.js >= 16](https://nodejs.org/en/) installed
3. Ensure you have [Yarn >= 1.22](https://yarnpkg.com/docs/install) installed
4. Install dependencies: `yarn install`
5. Start the UI: `yarn start`
6. Access the UI at [http://localhost:3000](http://localhost:3000)

## Docker

Run with Docker:

```bash
docker run --rm -it --name selendra-portal -p 80:80 selendra/selendra-portal:latest
```

Build locally:

```bash
docker build -t selendra/selendra-portal -f docker/Dockerfile .
```

Access via http://localhost

## Configuration

Chain configuration (API types, settings, logos) can be customized in the [apps-config package](packages/apps-config#README.md).

## License

Apache-2.0
