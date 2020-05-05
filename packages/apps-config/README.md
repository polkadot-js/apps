# @polkadot/apps-config

General config for various services, including settings, external links & types. This is a central source of all the configuration settings that can be tweaked. This also means that it can be customized (via PR) to support any additional chains. The internals are split into a number of settings -

- [api](./src/api) - Here you can add any chain or node-type specific types configuration. When added, it means that when the UI connects to either a runtime with a spec name, or a chain with a specific name, the types will be automatically added to the API as used in the app.
- [links](./src/links) - These are all links to external providers such as explorers. This information is used anywhere where there is an external link to determine the providers for these links.
- [settings](./src/settings) - These are used in dropdowns, specifically under the settings page.
- [ui](./src/ui) - Logos & color settings for chain and node spec specific overrides. This means that when the runtime/chain is detected, the specific logo would be used.

Customization for each of these are discussed next.

## Api

The API config can be done in one of two ways -

- [chain](./src/api/chain) - Here we are mapping to a specific chain name. Generally the next type would be preferred, however if you are supporting multiple chains with individual configs, you would probably want to add the chain-specific information in here.
- [spec](./src/api/spec) - Here we are mapping from the runtime spec name of the chain to specific types. This means that when connected to a specific spec, these types will be injected.

The actual type definitions you should be familiar with, it is exactly the same as you would upload via the settings page in JSON, or as detailed in the [API types pages](https://polkadot.js.org/api/start/types.extend.html#extending-types).

## Links

We are not going to spend too much time here, since it is generally applicable to explorers and like services. However, should you run one of these services, you can take a look at the existing configs and customize for your setup.

## Settings

There are 2 general areas of interest here -

- [endpoints](./src/settings) - This is where we can add additional endpoints to appear in the dropdowns. We would like to keep this to mostly live networks, although based on demand can probably extend to a testing-only section as well.
- [ss58](./src/settings) - Should you wish to add your ss58Format to the settings dropdown, this is where the configuration take place

## UI

These are self-explanatory and config here actually does get used in other parts as well. Basically the information here is broken down into a couple of categories -

- [general](./src/ui/general)
  - color configuration based on chain
- [identityIcon](./src/ui/identityIcons)
  - specific identityIcon to use based on node name
- [logos](./src/ui/logos)
  - chains - Specific logos when connecting to a specific chain
  - nodes - Logos that are used when connecting to a specific runtime spec type (catch-all)
  - named - These logos are used as overrides when we pass an explicit logo name 
