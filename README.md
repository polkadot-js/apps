<div align="Center">
<h1>avail-apps</h1>
<h3>Block Explorer & Apps for the Avail blockchain</h3>
</div>

<br>

# Introduction

`avail-apps` is a modified version of the [@polkadot/apps](https://github.com/polkadot-js/apps) repository for visualizing and interacting with the Avail network.

Learn more about Avail at the Avail [product page](https://www.availproject.org) and [documentation](https://availproject.github.io/) websites.

You can access a live version of the explorer for the Avail Testnet at https://kate.avail.tools/


## Overview

The repo is split into a number of packages, each representing an application.


## Development

Contributions are welcome!

To start off, this repo uses yarn workspaces to organize the code. As such, after cloning dependencies _should_ be installed via `yarn`, not via npm, the latter will result in broken dependencies.

To get started -

1. Clone the repo locally, via `git clone https://github.com/availproject/avail-apps.git <optional local path>`
2. Ensure that you have a recent LTS version of Node.js, for development purposes [Node >= 16](https://nodejs.org/en/) is recommended.
3. Ensure that you have a recent version of Yarn, for development purposes [Yarn >= 1.22](https://yarnpkg.com/docs/install) is required.
4. Install the dependencies by running `yarn`
5. Ready! Now you can launch the UI (assuming you have a local Avail Node running), via `yarn run start`
6. Access the UI via [http://localhost:3000](http://localhost:3000)
