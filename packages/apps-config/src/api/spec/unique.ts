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
        AccessMode: {
          _enum: ['Normal', 'WhiteList']
        },
        DecimalPoints: 'u8',
        CollectionMode: {
          _enum: {
            Invalid: null,
            NFT: null,
            Fungible: 'DecimalPoints',
            ReFungible: null
          }
        },
        Ownership: {
          Owner: 'AccountId',
          Fraction: 'u128'
        },
        FungibleItemType: {
          Value: 'u128'
        },
        NftItemType: {
          Owner: 'AccountId',
          ConstData: 'Vec<u8>',
          VariableData: 'Vec<u8>'
        },
        ReFungibleItemType: {
          Owner: 'Vec<Ownership<AccountId>>',
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
          ConstOnChainSchema: 'Vec<u8>'
        },
        RawData: 'Vec<u8>',
        Address: 'AccountId',
        LookupSource: 'AccountId',
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
        },
        AccountInfo: 'AccountInfoWithDualRefCount'
      }
    }
  ]
};

export default definitions;
