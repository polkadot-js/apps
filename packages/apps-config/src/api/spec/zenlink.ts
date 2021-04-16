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
        PairId: 'u32',
        Pair: {
          token_0: 'AssetId',
          token_1: 'AssetId',
          account: 'AccountId',
          total_liquidity: 'TokenBalance',
          lp_asset_id: 'AssetId'
        },
        PairInfo: {
          token_0: 'AssetId',
          token_1: 'AssetId',
          account: 'AccountId',
          total_liquidity: 'TokenBalance',
          holding_liquidity: 'TokenBalance',
          reserve_0: 'TokenBalance',
          reserve_1: 'TokenBalance',
          lp_asset_id: 'AssetId'
        },
        AssetId: {
          chain_id: 'u32',
          module_index: 'u8',
          asset_index: 'u32'
        },
        TokenId: 'u32',
        AssetProperty: {
          _enum: {
            FOREIGN: null,
            LP: 'LpProperty'
          }
        },
        LpProperty: {
          token_0: 'AssetId',
          token_1: 'AssetId'
        },
        TokenBalance: 'u128'
      }
    }
  ]
};

export default definitions;
