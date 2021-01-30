// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default {
  AssetId: {
    _enum: {
      NativeCurrency: null,
      ParaCurrency: 'u32'
    }
  },
  Pair: {
    account: 'AccountId',
    token_0: 'AssetId',
    token_1: 'AssetId',
    total_liquidity: 'TokenBalance'
  },
  PairId: 'u32',
  PairInfo: {
    account: 'AccountId',
    holding_liquidity: 'TokenBalance',
    reserve_0: 'TokenBalance',
    reserve_1: 'TokenBalance',
    token_0: 'AssetId',
    token_1: 'AssetId',
    total_liquidity: 'TokenBalance'
  },
  TokenBalance: 'u128'
};
