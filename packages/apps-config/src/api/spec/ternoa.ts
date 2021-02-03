// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  CapsuleID: 'u32',
  CapsuleIDOf: 'CapsuleID',
  CapsuleData: {
    offchain_uri: 'Vec<u8>',
    pk_hash: 'Hash',
    creator: 'AccountId',
    owner: 'AccountId',
    locked: 'bool'
  },
  LookupSource: 'AccountId'
};
