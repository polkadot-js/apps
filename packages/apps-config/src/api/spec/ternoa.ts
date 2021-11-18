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
        AccountDataOf: 'AccountData',
        Address: 'MultiAddress',
        NFTId: 'u32',
        NFTIdOf: 'NFTId',
        NFTSeriesId: 'u32',
        NFTData: {
          owner: 'AccountId',
          details: 'NFTDetails',
          sealed: 'bool',
          locked: 'bool'
        },
        NFTDetails: {
          offchain_uri: 'Vec<u8>',
          series_id: 'NFTSeriesId',
          is_capsule: 'bool'
        },
        LookupSource: 'MultiAddress',
        NFTSeriesDetails: {
          owner: 'AccountId',
          nfts: 'Vec<NFTId>'
        },
        NFTCurrencyCombined: {
          caps: 'Balance',
          tiime: 'Balance'
        },
        NFTCurrency: {
          _enum: {
            Caps: 'Balance',
            Tiime: 'Balance',
            Combined: 'NFTCurrencyCombined'
          }
        },
        NFTCurrencyId: {
          _enum: [
            'Caps',
            'Tiime'
          ]
        },
        Request: {
          shard: 'ShardIdentifier',
          cyphertext: 'Vec<u8>'
        },
        ShardIdentifier: 'Hash',
        MarketplaceId: 'u32',
        SaleInformation: {
          account_id: 'AccountId',
          price: 'NFTCurrency',
          marketplace_id: 'MarketplaceId'
        },
        Status: {
          _enum: [
            'Free',
            'Reserved'
          ]
        },
        MarketplaceType: {
          _enum: [
            'Public',
            'Private'
          ]
        },
        MarketplaceInformation: {
          kind: 'MarketplaceType',
          commission_fee: 'u8',
          owner: 'AccountId',
          allow_list: 'Vec<AccountId>',
          name: 'Vec<u8>'
        },
        ClusterId: 'u32',
        EnclaveId: 'u32',
        Cluster: {
          enclaves: 'Vec<EnclaveId>'
        },
        Url: 'Vec<u8>',
        Enclave: {
          api_url: 'Url'
        }
      }
    }
  ]
};

export default definitions;
