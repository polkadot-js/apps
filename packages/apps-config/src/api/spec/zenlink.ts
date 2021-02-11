// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
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
      }
    }
  ]
};

export default definitions;
