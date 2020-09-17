# @app-polkadot-ethereum-bridge

A Bridge UI that enables the transfer of ETH and ERC20 tokens from Ethereum to Substrate via Metamask.

## Setup

### Start the local substrate chain

Set up instructions for local substrate chain are [here](https://github.com/Snowfork/polkadot-ethereum/tree/main/parachain).

```bash
# After setup, start chain
./target/release/artemis-node --dev
```

### Start a local Ethereum chain

Set up instructions for local ethereum chain are [here](https://github.com/Snowfork/polkadot-ethereum/tree/main/ethereum).
```bash
# After setup, start chain
truffle develop

# Compile contracts
truffle compile

# Migrate contracts to local network
truffle migrate
```

After migrating, plug the deployed ETHApp and ERC20App contract addresses into the app-polkadot-ethereum-bridge config.

### Start substrate-ui

First, install project dependencies.
```bash
# Must use node version >= 10.18
nvm install 10.18
nvm use 10.18

# Remove yarn lock before install deps
rm ./yarn.lock

# Install deps
yarn
```

Now we can start the application.
```bash
# In Snowfork/substrate-ui
yarn run start
```

Navigate to `http://127.0.0.1:3000` and point the UI to the local substrate http endpoint by clicking in the upper left corner and selecting network "Local Node (Own, 127.0.0.1:9944)". Once you're connected to the local substrate network, you'll see the 'Bridge' option marked with a right arrow icon in the side menu. Select it and you'll navigate to the Bridge application hosted at `http://127.0.0.1:3000/#/app-polkadot-ethereum-bridge`.

You're now able to deposit Ethereum into the deployed Bank contract using the @app-polkadot-ethereum-bridge user interface.

### Local testing

Using the metamask browser extension add a new development chain pointed at ethereum's local http endpoint called 'dev'. The local network's http endpoint is logged by the `truffle develop` command.

The `truffle develop` command also logs a list of accounts and private keys on initialization. Copy the private key of address 0 and use it to import a new account to metamask. You should see an account on the 'dev' chain loaded with ~100 ethereum. Your account is pre-loaded with thousands of TEST tokens. Once you've approved some tokens to the Bank contract, reload the page and you'll be able to deposit ERC20 tokens into the deployed Bank contract.

Note: to use the ERC20App you must use the private key of address 0 on the linked local ethereum network.
