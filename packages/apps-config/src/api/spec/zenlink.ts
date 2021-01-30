// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  PairId: 'u32',
  Pair: {
    token_0: 'AssetId',
    token_1: 'AssetId',
    account: 'AccountId',
    total_liquidity: 'TokenBalance'
  },
  PairInfo: {
    token_0: 'AssetId',
    token_1: 'AssetId',
    account: 'AccountId',
    total_liquidity: 'TokenBalance',
    holding_liquidity: 'TokenBalance',
    reserve_0: 'TokenBalance',
    reserve_1: 'TokenBalance'
  },
  AssetId: {
    _enum: {
      NativeCurrency: null,
      ParaCurrency: 'u32'
    }
  },
  TokenBalance: 'u128'
};