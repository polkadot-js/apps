// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable sort-keys */

export default {
  Address: 'AccountId',
  AccountInfo: 'AccountInfoWithRefCount',
  AssetId: {
    _enum: {
      NativeCurrency: null,
      ParaCurrency: 'u32'
    }
  },
  LookupSource: 'AccountId',
  Pair: {
    token_0: 'AssetId',
    token_1: 'AssetId',
    account: 'AccountId',
    total_liquidity: 'TokenBalance'
  },
  PairId: 'u32',
  PairInfo: {
    token_0: 'AssetId',
    token_1: 'AssetId',
    account: 'AccountId',
    total_liquidity: 'TokenBalance',
    holding_liquidity: 'TokenBalance',
    reserve_0: 'TokenBalance',
    reserve_1: 'TokenBalance'
  },
  RefCount: 'u32',
  TokenBalance: 'u128'
};
