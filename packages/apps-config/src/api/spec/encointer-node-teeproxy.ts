// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */
/* eslint-disable camelcase */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  CeremonyPhaseType: {
    _enum: [
      'Registering',
      'Assigning',
      'Attesting'
    ]
  },
  CeremonyIndexType: 'u32',
  CurrencyIdentifier: 'Hash',
  CurrencyCeremony: {
    cid: 'CurrencyIdentifier',
    cindex: 'CeremonyIndexType'
  },
  Location: {
    lat: 'i64',
    lon: 'i64'
  },
  CurrencyPropertiesType: {
    name_utf8: 'Text',
    demurrage_per_block: 'i128'
  },
  ShardIdentifier: 'Hash',
  Request: {
    shard: 'ShardIdentifier',
    cyphertext: 'Vec<u8>'
  },
  Enclave: {
    pubkey: 'AccountId',
    mrenclave: 'Hash',
    timestamp: 'u64',
    url: 'Text'
  },
  // weight changed to u64 since 2.0.0-rc1 (commit 2051ecbf79e April 16th 2020
  Weight: 'u32'
};
