# azero.dev

A portal containing advanced tooling for the Aleph Zero users looking for more capabilities than a regular signer can provide, like RPC calls, multisig, metadata update etc.

The portal can be accessed through:
* **Mainnet**: https://azero.dev/
* **Testnet**: https://dev.azero.dev/
* **Devnet**: https://test.azero.dev/


## Overview

The repo is split into a number of packages, each representing an application.


## Development

To start off, this project uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started:

1. Clone the repo locally, via `git clone https://github.com/Cardinal-Cryptography/azero-dev <optional local path>`.
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >=10.13.0](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >=1.10.1](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`.
5. Ready! Now you can launch the UI via `yarn run start`.
6. Access the UI via [http://localhost:3000](http://localhost:3000)

## Desktop App

The main advantage of using Desktop App is that it by default stores encrypted accounts on the filesystem instead of browser's local storage.
Local storage is susceptible to attacks using XSS (Cross-Site Scripting). There's no such risk when with files stored on disk.

The desktop app uses the [Electron](https://www.electronjs.org/) framework. It provides the same features as web app, the only difference
being different account storage.

The accounts are stored in the following directories:
* Mac: `~/Library/Application Support/azero-dev/polkadot-accounts`
* Linux: `~/.config/azero-dev/polkadot-accounts` (or `$XDG_CONFIG_HOME/azero-dev/polkadot-accounts` if `$XDG_CONFIG_HOME` is defined)
* Windows: `%APPDATA%\azero-dev\polkadot-accounts`

For more details on the desktop app, head over to [Electron package README](https://github.com/Cardinal-Cryptography/azero-dev/blob/master/packages/apps-electron/README.md).

## Credits

This repos is a fork of https://github.com/polkadot-js/apps.
