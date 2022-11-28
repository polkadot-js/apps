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
        TokenType: {
          _enum: [
            'Transferrable',
            'BoundToAddress'
          ]
        },
        NftAssetData: {
          name: 'Vec<u8>',
          description: 'Vec<u8>',
          properties: 'Vec<u8>'
        },
        NftClassData: {
          deposit: 'Balance',
          properties: 'Vec<u8>',
          token_type: 'TokenType'
        },
        NetworkId: {
          _enum: {
            Any: 'Null',
            Named: 'Vec<u8>',
            Polkadot: 'Null',
            Kusama: 'Null'
          }
        },
        CurrencyId: {
          _enum: {
            Token: 'TokenSymbol'
          }
        },
        TokenSymbol: {
          _enum: [
            'NUUM',
            'AUSD',
            'ACA',
            'DOT'
          ]
        },
        CountryCurrencyId: 'u32',
        CurrencyIdOf: 'CurrencyId',
        BalanceIdOf: 'Balance',
        ChainId: {
          _enum: {
            RelayChain: 'Null',
            ParaChain: 'ParaId'
          }
        },
        XCurrencyId: {
          chain_id: 'ChainId',
          currency_id: 'CurrencyId'
        },
        GroupCollectionId: 'u64',
        ClassIdOf: 'u32',
        TokenIdOf: 'u32',
        SpotId: 'u32'
      }
    }
  ]
};

export default definitions;
