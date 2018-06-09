[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![isc](https://img.shields.io/badge/license-ISC-lightgrey.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![npm](https://img.shields.io/npm/v/@polkadot/apps.svg?style=flat-square)](https://www.npmjs.com/package/@polkadot/apps)
[![travis](https://img.shields.io/travis/polkadot-js/apps.svg?style=flat-square)](https://travis-ci.org/polkadot-js/apps)
[![greenkeeper](https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?style=flat-square)](https://greenkeeper.io/)
[![dependency](https://img.shields.io/david/polkadot-js/apps.svg?style=flat-square)](https://david-dm.org/polkadot-js/apps)
[![devDependency](https://img.shields.io/david/dev/polkadot-js/apps.svg?style=flat-square)](https://david-dm.org/polkadot-js/apps#info=devDependencies)

# @polkadot/apps

A Portal into the Polkadot network. Provides a view and interaction layer from a browser.

This can be accessed as a hosted application via [https://polkadot.js.org/apps/](https://polkadot.js.org/apps/).

## overview

The repo is split into a number of packages, each representing an application. These are -

- [apps](packages/apps/) This is the main entry point. It handles the selection sidebar and routing to the specific application being displayed.
- [app-accounts](packages/app-accounts/) A basic account management app.
- [app-addresses](packages/app-addresses/) A basic address management app.
- [app-explorer](packages/app-explorer/) A simple block explorer. It only shows the most recent blocks, updating as they become available.
- [app-extrinsics](packages/app-extrinsics/) Submission of extrinsics to a node.
- [app-rpc](packages/app-rpc/) Sumission of raw data to RPC endpoints.
- [app-storage](packages/app-storage/) A simple node storage query application. Multiple queries can be queued and updates as new values become available.
- [app-toolbox](packages/app-toolbox/) Utilities to manage data.
- [app-vanitygen](packages/app-vanitygen/) A toy that allows you to generate vanity addresses. Running `yarn run vanitygen --match <string>` runs the generator as a Node CLI app. (Orders of a magnitude faster due to the use of libsoldium bindings)

In addition the following libraries are also included in the repo. These are to be moved to the [@polkadot/ui](https://github.com/polkadot-js/ui/) repository once it reaches a base level of stability and usability. (At this point with the framework being tested on the apps above, it makes development easier having it close)

- [ui-app](packages/ui-app/) A reactive (using RxJS) application framework with a number of useful shared components.
- [ui-keyring](packages/ui-keyring/) A browser-specific wrapper around the base [@polkadot/util-keyring](https://github.com/polkadot-js/util/) library.
- [ui-signer](packages/ui-signer/) Signer implementation for apps.
- [ui-identicon](packages/ui-identicon/) Identity icon generator with raw publicKey as input
- [ui-react](packages/ui-react) A collection of base React components
- [ui-react-rx](packages/ui-react-rx) Base components that use the RxJS Observable APIs

## Application

For development purposes, after changing to a supported version of Node.js (>= 8.9.0) and installing relevant dependencies with `yarn install`, start a [Polkadot Node on your local machine that connects to the global PoC-1 Testnet](https://github.com/paritytech/polkadot) and specify a WebSockets RPC server TCP port of 8081 to accept connections from the apps entry point (i.e. `polkadot --chain=poc-1 --ws-port=8081`), the apps entry point can be launched with a WebSocket connection to Polkadot PoC-1 with `WS_URL=wss://poc-1.polkadot.io:9944 yarn run start` and accessing the application of [http://localhost:3000](http://localhost:3000)

## Demos

Demos for the different libraries can be viewed with `yarn run demo:<name>` and then browsing to [http://localhost:3000](http://localhost:3000). Available demo -

- `yarn run demo:identicon`
- `yarn run demo:ui`
- `yarn run demo:rx`
