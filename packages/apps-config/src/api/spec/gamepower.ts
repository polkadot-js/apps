// Copyright 2017-2022 @polkadot/apps-config authors & contributors
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
        AccountInfo: 'AccountInfoWithDualRefCount',
        AssetId: 'u64',
        SeriesId: 'u64',
        ClassId: 'u32',
        ClassIdOf: 'ClassId',
        ClassInfoOf: 'ClassInfo',
        TokenId: 'u64',
        TokenIdOf: 'TokenId',
        TokenInfoOf: 'TokenInfo',
        ClassInfo: {
          metadata: 'Vec<u8>',
          total_issuance: 'TokenId',
          owner: 'AccountId',
          data: 'NftClassData'
        },
        TokenInfo: {
          metadata: 'Vec<u8>',
          owner: 'AccountId',
          data: 'NftAssetData'
        },
        NftSeriesData: {
          name: 'Vec<u8>',
          owner: 'AccountId',
          properties: 'Vec<u8>'
        },
        NftClassData: {
          deposit: 'Balance',
          properties: 'Vec<u8>',
          token_type: 'TokenType',
          collection_type: 'CollectionType',
          total_supply: 'u64',
          initial_supply: 'u64'
        },
        NftAssetData: {
          deposit: 'Balance',
          name: 'Vec<u8>',
          description: 'Vec<u8>',
          properties: 'Vec<u8>'
        },
        TokenType: {
          _enum: [
            'Transferrable',
            'BoundToAddress'
          ]
        },
        CollectionType: {
          _enum: [
            'Collectable',
            'Wearable',
            'Executable'
          ]
        },
        ClassProperties: {
          Transferrable: 'bool',
          Burnable: 'bool'
        }
      }
    }
  ]
};

export default definitions;
