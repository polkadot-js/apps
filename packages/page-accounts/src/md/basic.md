# Account

An account is identified by its public address on the network. It is totally fine to give away this address, this is also the only information needed to receive funds. The network will **not** know about the name you give to this account in this application.

# Balances

The balances for each account is broken down into a number of areas, giving an overview of the totals, transferable and bonded funds as well as the funds currently being unbonded or redeemable. These are -

- **total**: The overall amount of funds in the account, this includes the vested balance, available for transfer and locked.
- **available**: The funds that can be transferred or bonded, i.e. the funds that are available for any transaction.
- **bonded**: The funds bonded for validating or nominating. They are locked and cannot be transferred, although it can be unlocked for future actions.
- **redeemable**: The funds that can get redeemed, e.g made available for withdrawal, by clicking on the "lock" icon.
- **unbonding**: The funds that are being unbonded. The funds will be redeemable after the bonding period has passed. These funds can still be slashed. The information icon tells the amount of blocks left before the funds can be redeemed.

# Security

The public address is generated from a private key, itself generated from a seed or a mnemonic phrase. The seed or the mnemonic phrase should **never be shared with anybody** as they give access to your funds. It must be stored securely.
The password needed to create an account is used to encrypt your private key. You must choose a strong and unique password.
This password is also used to encrypt the private key in the backup file downloaded upon account creation. Thanks to this file together with your account password, you can recover your account.

# Account recovery

You can recover an account from its:
- seed or mnemonic:
  Click on the "Add account" button, type your seed or mnemonic in the associated field.

- backup file (also called JSON keystore file) and the account's password:
  Click on "Restore JSON" button. Upload your backup file and type in the password associated.

# Minimum allowed balance

Accounts with a balance lower than the minimal amount, 100 milliUnits (miliDOTs for Polkadot) as of writing are considered as nonexistent for the network. If an account's balance ever drops below this amount, it is removed from the network. In this application, it will still be visible, but with a balance of 0.

For a fund transfer to a **new account** (read an account with a balance of 0), if the amount transferred is less than the minimum allowed balance, then the transfer will "succeed" but the destination account will not be created (read its balance will remain 0); this essentially burns the transfer balance from the sender, because the receiver's balance never exceed the minimum allowed balance.

If the receiver already exists (read it has a balance greater than 0), it is perfectly possible to transfer very low amounts.

# Cryptography

Substrate and Polkadot use Schnorrkel/Ristretto x25519 ("sr25519") as its key derivation and signing algorithm.

Sr25519 is based on the same underlying Curve25519 as its EdDSA counterpart, Ed25519. However, it uses Schnorr signatures instead of the EdDSA scheme. Schnorr signatures bring some noticeable benefits over the ECDSA/EdDSA schemes. For one, it is more efficient and still retains the same feature set and security assumptions. Additionally, it allows for native multisignature through signature aggregation.

If you wish to validate, the `session` account needs to use "ed25519" cryptography.
