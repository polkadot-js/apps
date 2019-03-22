# 0.26.1

- Swap keyring to HDKD derivation, mnemonic keys are now not backwards compatible with those created earlier. (Defaults are still for ed25519)
- Swap crypto to new WASM-backed version (and remove libsodium dependency)

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
