# @polkadot/apps-config

General config for various services, including settings & external links (see [the know-types package](../known-types/README.md) for API types config). This is a central source of all the non-types configuration settings that can be tweaked. This also means that it can be customized (via PR) to support any additional chains. The internals are split into a number of settings -

- [links](./src/links) - These are all links to external providers such as explorers. This information is used anywhere where there is an external link to determine the providers for these links.
- [settings](./src/settings) - These are used in dropdowns, specifically under the settings page.
- [ui](./src/ui) - Logos & color settings for chain and node spec specific overrides. This means that when the runtime/chain is detected, the specific logo would be used.

Customization for each of these are discussed next.

## Links

We are not going to spend too much time here, since it is generally applicable to explorers and like services. However, should you run one of these services, you can take a look at the existing configs and customize for your setup.

## Settings

There are 2 general areas of interest here -

- [endpoints](./src/settings) - This is where we can add additional endpoints to appear in the dropdowns. We would like to keep this to mostly live networks, although based on demand can probably extend to a testing-only section as well.
- [ss58](./src/settings) - Should you wish to add your ss58Format to the settings dropdown, this is where the configuration take place

## UI

These are self-explanatory and config here actually does get used in other parts as well. Basically the information here is broken down into a couple of categories -

- [colors](./src/ui/colors.ts)
  - color configuration based on chain
- [identityIcon](./src/ui/identityIcons)
  - specific identityIcon to use based on node name
- [logos](./src/ui/logos)
  - chains - Specific logos when connecting to a specific chain
  - nodes - Logos that are used when connecting to a specific runtime spec type (catch-all)
  - named - These logos are used as overrides when we pass an explicit logo name 

**Note:** API types configuration can be done in the [@polkadot/known-types](../known-types/README.md) package.
