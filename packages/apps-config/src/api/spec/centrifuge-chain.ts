// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  // chain-specific
  AnchorData: {
    id: 'H256',
    docRoot: 'H256',
    anchoredBlock: 'u64'
  },
  Fee: {
    key: 'Hash',
    price: 'Balance'
  },
  PreCommitData: {
    signingRoot: 'H256',
    identity: 'H256',
    expirationBlock: 'u64'
  },
  Proof: {
    leafHash: 'H256',
    sortedHashes: 'H256'
  },
  // MultiAccount
  MultiAccountData: {
    threshold: 'u16',
    signatories: 'Vec<AccountId>',
    deposit: 'Balance',
    depositor: 'AccountId'
  },
  Address: 'GenericAddress',
  LookupSource: 'GenericAddress',
  // Bridge constants
  ChainId: 'u8',
  ResourceId: '[u8; 32]',
  'chainbridge::ChainId': 'u8',
  DepositNonce: 'u64'
};
