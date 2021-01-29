// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'MultiAddress',
  Enclave: {
    mrenclave: 'Hash',
    pubkey: 'AccountId',
    timestamp: 'u64',
    url: 'Text'
  },
  LookupSource: 'MultiAddress',
  Request: {
    cyphertext: 'Vec<u8>',
    shard: 'ShardIdentifier'
  },
  ShardIdentifier: 'Hash'
};
