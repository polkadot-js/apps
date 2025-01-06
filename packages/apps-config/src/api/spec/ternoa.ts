// Copyright 2017-2025 @polkadot/apps-config authors & contributors
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
        LookupSource: 'MultiAddress',
        ShardIdentifier: 'Hash',
        Url: 'Text',
        URI: 'Text',
        ClusterId: 'u32',
        EnclaveId: 'u32',
        MarketplaceId: 'u32',
        BalanceCaps: 'Balance',
        NFTId: 'u32',
        TernoaString: 'Vec<u8>',
        NFTSeriesId: 'Text',
        NFTData: {
          owner: 'AccountId',
          ipfs_reference: 'Text',
          series_id: 'NFTSeriesId',
          locked: 'bool'
        },
        NFTSeriesDetails: {
          owner: 'AccountId',
          draft: 'bool'
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
        SaleInformation: {
          account_id: 'AccountId',
          price: 'NFTCurrency',
          marketplace_id: 'MarketplaceId'
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
          disallow_list: 'Vec<AccountId>',
          name: 'Text',
          uri: 'Option<URI>',
          logo_uri: 'Option<URI>'
        },
        Cluster: {
          enclaves: 'Vec<EnclaveId>'
        },
        Enclave: {
          api_url: 'Url'
        },
        CapsuleData: {
          owner: 'AccountId',
          ipfs_reference: 'Text'
        },
        CapsuleLedger: 'Vec<(NFTId, Balance)>',
        Status: {
          _enum: [
            'Free',
            'Reserved'
          ]
        },
        Request: {
          shard: 'ShardIdentifier',
          cyphertext: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
