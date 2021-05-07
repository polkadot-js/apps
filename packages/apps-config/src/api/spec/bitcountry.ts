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
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AssetInfo: {
          owner: 'AccountId',
          data: 'AssetData'
        },
        AssetData: {
          name: 'Text',
          description: 'Text',
          properties: 'Text',
          supporters: 'Vec<AccountId>'
        },
        AuctionId: 'u64',
        AuctionItem: {
          asset_id: 'TokenId',
          class_id: 'ClassId',
          recipient: 'AccountId',
          initial_amount: 'Balance',
          amount: 'Balance',
          start_time: 'u32',
          end_time: 'u32'
        },
        AuctionInfo: {
          bid: 'Option<(AccountId,Balance)>',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>'
        },
        RentId: 'u64',
        RentalInfo: {
          owner: 'AccountId',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>',
          price_per_block: 'Balance'
        },
        CountryId: 'u64',
        CountryCurrencyId: 'u32',
        CollectionId: 'u64',
        ClassId: 'u32',
        TokenId: 'u64',
        ClassInfoOf: {
          metadata: 'Vec<u8>',
          total_issuance: 'TokenId',
          owner: 'AccountId',
          data: 'NftClassData'
        },
        TokenInfoOf: {
          metadata: 'Vec<u8>',
          owner: 'AccountId',
          data: 'NftAssetData'
        },
        NftCollectionData: {
          name: 'Vec<u8>',
          owner: 'AccountId',
          properties: 'Vec<u8>'
        },
        CurrencyId: 'u32',
        CurrencyIdOf: 'CurrencyId',
        BalanceIdOf: 'Balance',
        GroupCollectionId: 'u64',
        ClassIdOf: 'u32',
        TokenIdOf: 'u32',
        SpotId: 'u32'
      }
    }
  ]
};

export default definitions;
