# 0.39.1

- **Breaking** Drop support for V1 Substrate chains
- Translation into Chinese (Thanks to https://github.com/dushaobindoudou)
- Support for sign-only transactions (Thanks to https://github.com/mzolkiewski)
- Add support for WestEnd testnet
- Add support for social recovery in accounts
- Add counters for all proposal-based apps
- Disable spellcheck on all input fields (privacy)
- Query the paymentInfo API to get weight fee information
- Remove FF warning with https:// -> ws://localhost
- Staking now supports where the controller or stash accounts are not local
- Social app
- Add support for identity setting (via identity module)
- Add support for registrars to hand out identity judgements
- Use both internal and lib hooks as applicable (refactoring)
- Support QR codes (accounts) with optional names
- Cleanup all Modals, simplify
- Adjust balance display formats
- Update to latest libraries (incl. util 2.0 & api 1.0)

# 0.38.1

- Fix summarybar in 123-code (Thanks to https://github.com/anakornk)
- Update Edgeware with correct keys (Thanks to https://github.com/drewstone)
- Add InputAddressMulti inputs, both to council and staking nominators
- Rework all layouts, removing cards for table-ike-layouts
- Technical comittee app
- Allow for external proposal and queued for dispatch in democracy
- Add pre-image support to democracy proposals (including imminent)
- Improved staking page rendering (background)
- Update to latest libraries

# 0.37.1

- Support for Kusama CC3
- Support for contracts with new ABI v2 (Thanks to @kwingram25)
- Support for on-chain nicks
- Speed improvements for the staking pages
- Add account derivation from existing account
- Council voting with runner up & phragmen
- Allow favorites in validators pages
- Rework nominations to take favorites & current into account
- Enhance AddressCard with additional info (incl. vested)
- Move account/address actions to popup menu
- Convert a large number of components to use hooks
- Display validator graphs
- Refactor of backup modal (Thanks to @LukeSugiura)
- Enable language setting options (Thanks to @LukeSugiura)
- Allow for signRaw to be used in the signing toolbox (injected accounts)
- Display account names in status events
- Nomination targets dashboard
- Validator preferences are expressed as commission % as supported by chains
- Account locks are applied on a genesis range (e.g. CC2 & CC3 allow availability)
- ... lots of smaller enhancements & bug fixes

# 0.36.1

- Api 0.95.1, Util 1.6.1, Extension 0.13.1
- Support latest contracts ABI (via API), incl. rework of contracts UI
- Support for Kusama CC2
- Support for Edgeware mainnet
- Experimental Ledger support
- Display forks on explorer (limited to Babe)
- Change settings to have Save as well as Save & Reload (depending on changes made)
- Updates to struct & enum rendering (as per extrinsic app)
- Backup, Password change & Delete don't show for built-in dev accounts
- Add commissions to the staking overview
- UI theme update
- A large number of components refactored for React functional components
- Allow dismiss of all notifications (via bounty)
- Migrate all buttons to have icons (via bounty)
- Proposal submission via modal (via bounty)
- i18n string extraction (via bounty)
- adjust signature validity (via bounty)
- Make the network selection clickable on network name (via bounty)
- ... and a number of cleanups all around

# 0.35.1

- Api 0.91.1, Util 1.2.1, Extension 0.10.1
- Support for accounts added via Qr (for instance, the Parity Signer)
- Support for accounts tied to specific chains (instead of just available to all)
- GenericAsset app transfers
- Support for Edgeware with default types
- Display received heartbeats for validators
- Allow optional params (really as optional) in RPC toolbox
- Add Polkascan for Kusama
- Fix account derivation with `///password`
- Lots of component & maintainability cleanups

# 0.34.1

- Kusama support
- Full support for Substrate 2.x & Polkadot 0.5.0 networks
- Lots of UI updated to support both Substrate 1.x & 2.x chains
- Add of claims app for Kusama (and Polkadot)
- Basic Council, Parachains & Treasury apps
- Moved ui-* packages to react-*

# 0.33.1

- Allow for externally injected accounts (i.e. via extension, polkadot-js & SingleSource)
- Links to extrnisics & addresses on Polkascan
- Rework Account & Address layouts with cards
- Transfer can happen from any point (via Transfer modal)
- Use new api.derive functions
- Introduce multi support (most via api.derive.*)
- Update all account and address modals
- Add seconding of proposals
- Staking updates, including un-bonding & withdrawals
- Update explorer with global query on hash/blocks
- Add filters on the staking page
- Vanitygen now supports sr25519 as well
- Fixes for importing of old JSON
- Latest @polkadot/util & @polkadot/api
- A large number of optimizations and smaller fixes

# 0.32.1

- Support for Substrate 1.0 release & metadata v4
- @polkadot/api 0.77.1

# 0.31.1

- Cleanups, fixes and features around the poc-4 staking module
- Number of UI enhancements

# 0.30.1

- Staking page indicator for offline nodes (count & block)
- Rework page tabs and content layouts
- Cleanup of all UI summary headers
- Emberic Elem support (replaces Dried Danta)

# 0.29.1

- @polkadot/util & @polkadot/api 0.75.1

# 0.28.1

- Support for substrate 1.0-rc

# 0.27.1

- Bring in new staking & nominating functions
- Swap default keyring accounts (on creation) to sr25519
- New faster crypto algorithms
- Misc. bug fixes all around

# 0.26.1

- Swap keyring to HDKD derivation, mnemonic keys are now not backwards compatible with those created earlier. (Defaults are still for ed25519)
- Swap crypto to new WASM-backed version (and remove libsodium dependency)
- UI to allow for derived keys for ed25519 and sr25519
- New mobile-friendly sidebar
- Fix issues with nominating (old non-bonds interface)

# 0.25.1

- Swap to publishing -beta.x on merge (non-breaking testing)

 # 0.24.1

 Storage now handles Option type properly

 # 0.23.1

 JavaScript console introduced

# 0.22.1

- Use new Compact<Index> transaction format - this requires the latest binaries from either Polkadot or Substrate

# 0.21.1

- PoC-3 support with latest Substrate master & Polkadot master
- Add support for Charred Cherry (Substrate) and Alexander (Polkadot) testnets
- Too many changes to mention, master now only supports latest PoC-3 iteration
- Use https://poc-2.polkadot.io if access is required to PoC-2 era networks
