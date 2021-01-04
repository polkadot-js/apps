// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  Campaign: {
    id: 'Hash',
    manager: 'AccountId',
    deposit: 'Balance',
    expiry: 'BlockNumber',
    cap: 'Balance',
    name: 'Vec<u8>',
    protocol: 'u8',
    status: 'u8'
  },
  EventMessage: 'Vec<u8>',
  Nonce: 'u64'
};
