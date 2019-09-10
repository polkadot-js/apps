# 0.35.1

- Api 0.91.1, Util 1.2.1, Extension 0.10.1
- Support for accouns added via Qr (for instance, the Parity Signer)
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
- Transfer can happen from any popint (via Transfer modal)
- Use new api.derive functions
- Introduce multi support (most via api.derive.*)
- Update all account and address modals
- Add seconding of proposals
- Staking updates, including unbonding & withdrawals
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
