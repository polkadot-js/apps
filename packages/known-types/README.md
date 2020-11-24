# @polkadot/known-types

Configuration for API types used in polkadot.js apps (and published as a _unstable_ npm package for external users). This is a centralized source where all polakdot-js/apps API types configuration can be set. This also means that it can be customized (via PR) to support any additional chains.

In this package you can add any chain or node-type specific API types configuration. When added, it means that when the UI connects to either a runtime with a spec name, or a chain with a specific name, the types will be automatically added to the API as used in the app.

The API types configuration can be done in one of two ways

- [chain](./src/chain) - Here we are mapping to a specific chain name. Generally the next type would be preferred, however if you are supporting multiple chains with individual configs, you would probably want to add the chain-specific information in here.
- [spec](./src/spec) - Here we are mapping from the runtime spec name of the chain to specific types. This means that when connected to a specific spec, these types will be injected.

The actual type definitions you should be familiar with, it is exactly the same as you would upload via the settings page in JSON, or as detailed in the [API types pages](https://polkadot.js.org/api/start/types.extend.html#extending-types).

**Note:** For configuration of the apps general services, including settings & external links, see [the apps-config package](../apps-config/READEME.md).