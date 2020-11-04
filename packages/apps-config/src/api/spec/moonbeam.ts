// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  Account: {
    nonce: 'U256',
    balance: 'U256'
  },
  AccountId: 'EthereumAccountId',
  Address: 'AccountId',
  Balance: 'u128',
  LookupSource: 'AccountId',
  RefCount: 'u8'
};
