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
            aUSD: 2,
            DOT: 3,
            KSM: 4,
            ETH: 5
          }
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol',
            VToken: 'TokenSymbol',
            Native: 'TokenSymbol',
            Stable: 'TokenSymbol',
            VSToken: 'TokenSymbol',
            VSBond: '(TokenSymbol, ParaId, LeasePeriod, LeasePeriod)'
          }
        },
        CurrencyIdOf: 'CurrencyId',
        TAssetBalance: 'Balance',
        AmountOf: 'i128',
        StorageVersion: 'Releases',
        ShareWeight: 'Balance',
        OrmlAccountData: {
          free: 'Balance',
          reserved: 'Balance',
          frozen: 'Balance'
        },
        BancorPool: {
          currency_id: 'CurrencyId',
          token_pool: 'Balance',
          vstoken_pool: 'Balance',
          token_base_supply: 'Balance',
          vstoken_base_supply: 'Balance'
        },
        PalletBalanceOf: 'Balance',
        BlockNumberFor: 'BlockNumber',
        NumberOrHex: {
          _enum: {
            Number: 'u64',
            Hex: 'U256'
          }
        },
        IsExtended: 'bool',
        SystemPalletId: 'PalletId',
        RewardRecord: {
          account_id: 'AccountId',
          record_amount: 'Balance'
        },
        MaxLocksOf: 'u32',
        VestingInfo: {
          locked: 'Balance',
          per_block: 'Balance',
          starting_block: 'BlockNumber'
        },
        OrderId: 'u64',
        OrderInfo: {
          owner: 'AccountIdOf',
          currency_sold: 'CurrencyIdOf',
          amount_sold: 'BalanceOf',
          currency_expected: 'CurrencyIdOf',
          amount_expected: 'BalanceOf',
          order_id: 'OrderId',
          order_state: 'OrderState'
        },
        OrderState: {
          _enum: [
            'InTrade',
            'Revoked',
            'Clinchd'
          ]
        },
        ZenlinkAssetId: {
          chain_id: 'u32',
          asset_type: 'u8',
          asset_index: 'u32'
        },
        ZenlinkAssetBalance: 'u128',
        PairInfo: {
          asset0: 'ZenlinkAssetId',
          asset1: 'ZenlinkAssetId',
          account: 'AccountId',
          totalLiquidity: 'ZenlinkAssetBalance',
          holdingLiquidity: 'ZenlinkAssetBalance',
          reserve0: 'ZenlinkAssetBalance',
          reserve1: 'ZenlinkAssetBalance',
          lpAssetId: 'ZenlinkAssetId'
        }
      }

    }
  ]
};

export default definitions;
