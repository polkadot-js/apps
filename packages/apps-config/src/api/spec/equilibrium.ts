// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  BlockNumber: 'u64',
  Keys: 'SessionKeys3',
  Balance: 'u64',
  FixedI64: 'i64',
  SignedBalance: {
    _enum: {
      Positive: 'Balance',
      Negative: 'Balance'
    }
  },
  ReinitRequest: {
    account: 'AccountId',
    authority_index: 'AuthIndex',
    validators_len: 'u32',
    block_num: 'BlockNumber'
  },
  Currency: {
    _enum: [
      'Unknown',
      'Usd',
      'EQ',
      'Eth',
      'Btc',
      'Eos'
    ]
  },
  DataPoint: {
    price: 'u64',
    account_id: 'AccountId'
  },
  PricePoint: {
    block_number: 'BlockNumber',
    timestamp: 'u64',
    price: 'u64',
    data_points: 'Vec<DataPoint>'
  },
  BalancesAggregate: {
    total_issuance: 'Balance',
    total_debt: 'Balance'
  },
  VestingInfo: {
    locked: 'Balance',
    perBlock: 'Balance',
    startingBlock: 'BlockNumber'
  },
  LookupSource: 'AccountId',
  BalanceOf: 'Balance'
};
