// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  RefCount: 'u8',
  Account: {
    nonce: 'U256',
    balance: 'U256'
  },
  Transaction: {
    nonce: 'U256',
    action: 'String',
    gas_price: 'u64',
    gas_limit: 'u64',
    value: 'U256',
    input: 'Vec<u8>',
    signature: 'Signature'
  },
  Signature: {
    v: 'u64',
    r: 'H256',
    s: 'H256'
  },
  ExitReason: 'U256',
  AccountServiceEnum: {
    _enum: {
      Nickname: 'String',
      Ethereum: 'H160'
    }
  },
  MultiAddressDetails: {
    nickname: 'AccountServiceEnum',
    ethereum: 'AccountServiceEnum'
  },
  Nickname: 'String',
  Ethereum: 'H160'
};
