# @polkadot/apps-config

General config for various services, including settings, external links & types. This is a central source of all the configuration settings that can be tweaked. This also means that it can be customized (via PR) to support any additional chains. The internals are split into a number of settings -

- [api](./src/api) - Here you can add any chain or node-type specific types configuration. When added, it means that when the UI connects to either a runtime with a spec name, or a chain with a specific name, the types will be automatically added to the API as used in the app.
- [endpoints](./src/endpoints) - Configuration for specific per-type chain endpoints.

Customization for each of these are discussed next.

## Api

The API config can be done in one of two ways -

- [chain](./src/api/chain) - Here we are mapping to a specific chain name. Generally the next type would be preferred, however if you are supporting multiple chains with individual configs, you would probably want to add the chain-specific information in here.
- [spec](./src/api/spec) - Here we are mapping from the runtime spec name of the chain to specific types. This means that when connected to a specific spec, these types will be injected.

The actual type definitions you should be familiar with, it is exactly the same as you would upload via the settings page in JSON, or as detailed in the [API types pages](https://polkadot.js.org/docs/api/start/types.extend).


## Endpoints

1. Add your chain logo (if available) to either `ui/logos/chains` or `ui/logos/nodes` (the second is generally used)
2. Run the image build command to generate an inline version via `yarn build:images`
3. Add your chain to `endpoints/{production, productionRelay, testing, testingRelay*}` as applicable for your deployment
3. The `ui.color` specifies the chain color, the `ui.logo` (imported from generated), specifies the specific logo
