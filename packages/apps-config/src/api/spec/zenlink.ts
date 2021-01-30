// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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