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
        TokenSymbol: {
          _enum: {
            ASG: 0,
            aUSD: 1,
            DOT: 2,
            vDOT: 3,
            KSM: 4,
            vKSM: 5,
            ETH: 6,
            vETH: 7,
            EOS: 8,
            vEOS: 9,
            IOST: 10,
            vIOST: 11
          }
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        AmountOf: 'i128',
        ChainId: {
          _enum: {
            RelayChain: 'Null',
            ParaChain: 'ParaId'
          }
        },
        XCurrencyId: {
          chainId: 'ChainId',
          currencyId: 'Vec<u8>'
        },
        CurrencyIdOf: 'CurrencyId',
        IsExtended: 'bool',
        StorageVersion: 'Releases',
        ShareWeight: 'Balance',
        PalletBalanceOf: 'Balance',
        BlockNumberFor: 'BlockNumber',
        NumberOrHex: {
          _enum: {
            Number: 'u64',
            Hex: 'U256'
          }
        },
        TokenBalance: 'Balance',
        TokenId: 'u32',
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
        AssetProperty: {
          _enum: {
            Foreign: null,
            Lp: 'LpProperty'
          }
        },
        LpProperty: {
          token_0: 'AssetId',
          token_1: 'AssetId'
        }
      }

    }
  ]
};

export default definitions;
