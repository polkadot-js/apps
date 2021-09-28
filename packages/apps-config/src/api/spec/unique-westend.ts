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
        AccountInfo: 'AccountInfoWithTripleRefCount',
        CrossAccountId: {
          _enum: {
            substrate: 'AccountId',
            ethereum: 'H160'
          }
        },
        AccessMode: {
          _enum: ['Normal', 'WhiteList']
        },
        CallSpec: {
          Module: 'u32',
          Method: 'u32'
        },
        DecimalPoints: 'u8',
        CollectionMode: {
          _enum: {
            NFT: null,
            Fungible: 'DecimalPoints',
            ReFungible: null
          }
        },
        Ownership: {
          Owner: 'CrossAccountId',
          Fraction: 'u128'
        },
        FungibleItemType: {
          Value: 'u128'
        },
        NftItemType: {
          Owner: 'CrossAccountId',
          ConstData: 'Vec<u8>',
          VariableData: 'Vec<u8>'
        },
        ReFungibleItemType: {
          Owner: 'Vec<Ownership<CrossAccountId>>',
          ConstData: 'Vec<u8>',
          VariableData: 'Vec<u8>'
        },
        SponsorshipState: {
          _enum: {
            Disabled: null,
            Unconfirmed: 'AccountId',
            Confirmed: 'AccountId'
          }
        },
        Collection: {
          Owner: 'AccountId',
          Mode: 'CollectionMode',
          Access: 'AccessMode',
          DecimalPoints: 'DecimalPoints',
          Name: 'Vec<u16>',
          Description: 'Vec<u16>',
          TokenPrefix: 'Vec<u8>',
          MintMode: 'bool',
          OffchainSchema: 'Vec<u8>',
          SchemaVersion: 'SchemaVersion',
          Sponsorship: 'SponsorshipState',
          Limits: 'CollectionLimits',
          VariableOnChainSchema: 'Vec<u8>',
          ConstOnChainSchema: 'Vec<u8>',
          MetaUpdatePermission: 'MetaUpdatePermission',
          TransfersEnabled: 'bool'
        },
        RawData: 'Vec<u8>',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        Weight: 'u64',
        CreateNftData: {
          const_data: 'Vec<u8>',
          variable_data: 'Vec<u8>'
        },
        CreateFungibleData: {
          value: 'u128'
        },
        CreateReFungibleData: {
          const_data: 'Vec<u8>',
          variable_data: 'Vec<u8>',
          pieces: 'u128'
        },
        CreateItemData: {
          _enum: {
            NFT: 'CreateNftData',
            Fungible: 'CreateFungibleData',
            ReFungible: 'CreateReFungibleData'
          }
        },
        SchemaVersion: {
          _enum: [
            'ImageURL',
            'Unique'
          ]
        },
        MetaUpdatePermission: {
          _enum: [
            'ItemOwner',
            'Admin',
            'None'
          ]
        },
        CollectionId: 'u32',
        TokenId: 'u32',
        ChainLimits: {
          CollectionNumbersLimit: 'u32',
          AccountTokenOwnershipLimit: 'u32',
          CollectionAdminsLimit: 'u64',
          CustomDataLimit: 'u32',
          NftSponsorTimeout: 'u32',
          FungibleSponsorTimeout: 'u32',
          RefungibleSponsorTimeout: 'u32',
          OffchainSchemaLimit: 'u32',
          VariableOnChainSchemaLimit: 'u32',
          ConstOnChainSchemaLimit: 'u32'
        },
        CollectionLimits: {
          AccountTokenOwnershipLimit: 'u32',
          SponsoredDataSize: 'u32',
          SponsoredDataRateLimit: 'Option<BlockNumber>',
          TokenLimit: 'u32',
          SponsorTimeout: 'u32',
          OwnerCanTransfer: 'bool',
          OwnerCanDestroy: 'bool'
        }
      }
    }
  ]
};

export default definitions;
