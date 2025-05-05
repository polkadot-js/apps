// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */
/* eslint-disable camelcase */

import type { OverrideBundleDefinition } from '@polkadot/types/types';

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Properties: 'u8',
        NFTMetadata: 'Vec<u8>',
        BlockNumber: 'u32',
        BlockNumberOf: 'BlockNumber',

        OrderData: {
          currencyId: 'Compact<CurrencyIdOf>',
          price: 'Compact<Balance>',
          deposit: 'Compact<Balance>',
          deadline: 'Compact<BlockNumberOf>',
          categoryId: 'Compact<CategoryIdOf>'
        },

        CategoryId: 'u32',
        CategoryIdOf: 'CategoryId',
        CategoryData: {
          metadata: 'NFTMetadata',
          nftCount: 'Compact<Balance>'
        },

        CurrencyId: 'u32',
        CurrencyIdOf: 'CurrencyId',
        Amount: 'i128',
        AmountOf: 'Amount',

        ClassId: 'u32',
        ClassIdOf: 'ClassId',
        ClassInfoOf: {
          metadata: 'NFTMetadata',
          totalIssuance: 'TokenId',
          owner: 'AccountId',
          data: 'ClassData'
        },
        ClassData: {
          deposit: 'Compact<Balance>',
          properties: 'Properties',
          name: 'Vec<u8>',
          description: 'Vec<u8>',
          createBlock: 'Compact<BlockNumberOf>'
        },

        TokenId: 'u64',
        TokenIdOf: 'TokenId',
        TokenInfoOf: { metadata: 'NFTMetadata', owner: 'AccountId', data: 'TokenData' },
        TokenData: {
          deposit: 'Compact<Balance>',
          createBlock: 'Compact<BlockNumberOf>'
        }
      }
    }
  ]
};

export default definitions;
