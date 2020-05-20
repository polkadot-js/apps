[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange?style=flat-square)](https://polkadot.js.org)
![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)
[![npm](https://img.shields.io/npm/v/@polkadot/apps?logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/apps)
[![beta](https://img.shields.io/npm/v/@polkadot/apps/beta?label=beta&logo=npm&style=flat-square)](https://www.npmjs.com/package/@polkadot/apps)
[![maintainability](https://img.shields.io/codeclimate/maintainability-percentage/polkadot-js/apps?logo=code-climate&style=flat-square)](https://codeclimate.com/github/polkadot-js/apps)

# @polkadot/apps

A Portal into the Polkadot and Substrate networks. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via [https://polkadot.js.org/apps/](https://polkadot.js.org/apps/) or you can access the [IPFS hosted version](https://polkadot.js.org/apps/ipfs) to explore any of the supported Polkadot and Substrate chains

**Important** If you are a chain developer and would like to add support for your chain to the UI, all the local configuration (API types, settings, logos) can be customized in [the apps-config package](packages/apps-config#README.md), complete with instructions of what goes where.

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [page-accounts](packages/page-accounts/) A basic account management app.
- [page-address-book](packages/page-address-book/) A basic address management app.
- [page-democracy](packages/page-democracy/) A basic voting app, allowing votes on activate proposals and referenda.
- [page-explorer](packages/page-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [page-extrinsics](packages/page-extrinsics/) Submission of extrinsics to a node.
- [page-js](packages/page-js/) An online code editor with [@polkadot-js/api](https://github.com/polkadot-js/api/tree/master/packages/api) access to the currently connected node.
- [page-settings](packages/page-settings/) A basic settings management app, allowing choice of language, node to connect to, and theme
- [page-staking](packages/page-staking/) A basic staking management app, allowing staking and nominations.
- [page-storage](packages/page-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [page-toolbox](packages/page-toolbox/) Submission of raw data to RPC endpoints and utility hashing functions.
- [page-transfer](packages/page-transfer/) A basic account management app, allowing transfer of Units/DOTs between accounts.

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [react-components](packages/react-components/) A reactive (using RxJS) application framework with a number of useful shared components.
- [react-signer](packages/react-signer/) Signer implementation for apps.
- [react-query](packages/react-query) Base components that use the RxJS Observable APIs

## development

Contributions are welcome!

To start off, this repo (along with others in the [@polkadot](https://github.com/polkadot-js/) family) uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/polkadot-js/apps <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Polkadot Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## I want to code around

There is a base template available [page-123code](packages/page-123code/) that acts as a simple starting point for adding additional apps to the UI. Alternatively if you just want some place where you can write some code, it does the trick.

While it is hidden from the sidebar, it is accessible via [http://127.0.0.1:3000/#/123code](http://127.0.0.1:3000/#/123code)

Be sure to follow the [page-123code/README.md](packages/page-123code/README.md) instructions.

## Docker

You can run a docker container via -

  docker run --rm -it --name polkadot-ui -e WS_URL=ws://someip:9944 -p 80:80 chevdor/polkadot-ui:latest

To build a docker container containing local changes -

  docker build -t chevdor/polkadot-ui .

When using these Docker commands, you can access the UI via http://localhost:80 (or just http://localhost)
