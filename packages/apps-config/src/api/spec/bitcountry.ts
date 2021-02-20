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
        Balance: 'u128',
        AssetId: 'u64',
        BlockNumber: 'u32',
        AssetInfo: {
          owner: 'AccountId',
          data: 'AssetData'
        },
        AssetData: {
          name: 'Vec<u8>',
          description: 'Vec<u8>',
          properties: 'Vec<u8>',
          supporters: 'Vec<AccountId>'
        },
        AuctionId: 'u64',
        AuctionItem: {
          asset_id: 'AssetId',
          recipient: 'AccountId',
          initial_amount: 'Balance',
          amount: 'Balance',
          start_time: 'u32',
          ed_time: 'u32'
        },
        AuctionInfo: {
          bid: 'Option<(AccountId,Balance)>',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>'
        },
        RentId: 'u64 ',
        RentalInfo: {
          owner: 'AccountId',
          start: 'BlockNumber',
          end: 'Option<BlockNumber>',
          price_per_block: 'Balance'
        },
        CountryId: 'u64',
        CollectionId: 'u64',
        CurrencyId: 'u32',
        TokenId: 'u64',
        CurrencyIdOf: 'CurrencyId',
        BalanceIdOf: 'Balance'
      }
    }
  ]
};

export default definitions;
