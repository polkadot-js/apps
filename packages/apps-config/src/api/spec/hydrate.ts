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
        Amount: 'i128',
        AmountOf: 'Amount',
        Address: 'AccountId',
        OrmlAccountData: {
          free: 'Balance',
          frozen: 'Balance',
          reserved: 'Balance'
        },
        Fee: {
          numerator: 'u32',
          denominator: 'u32'
        },
        BalanceInfo: {
          amount: 'Balance',
          assetId: 'AssetId'
        },
        CurrencyId: 'AssetId',
        CurrencyIdOf: 'AssetId',
        Intention: {
          who: 'AccountId',
          asset_sell: 'AssetId',
          asset_buy: 'AssetId',
          amount: 'Balance',
          discount: 'bool',
          sell_or_buy: 'IntentionType'
        },
        IntentionId: 'u128',
        IntentionType: {
          _enum: [
            'SELL',
            'BUY'
          ]
        },
        LookupSource: 'AccountId',
        OrderedSet: 'Vec<AssetId>',
        Price: 'Balance',
        Chain: {
          genesisHash: 'Vec<u8>',
          lastBlockHash: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
