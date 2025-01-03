// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const logionDefault = {
  Address: 'MultiAddress',
  LookupSource: 'MultiAddress',
  PeerId: '(Vec<u8>)',
  AccountInfo: 'AccountInfoWithDualRefCount',
  TAssetBalance: 'u128',
  AssetId: 'u64',
  AssetDetails: {
    owner: 'AccountId',
    issuer: 'AccountId',
    admin: 'AccountId',
    freezer: 'AccountId',
    supply: 'Balance',
    deposit: 'DepositBalance',
    max_zombies: 'u32',
    min_balance: 'Balance',
    zombies: 'u32',
    accounts: 'u32',
    is_frozen: 'bool'
  },
  AssetMetadata: {
    deposit: 'DepositBalance',
    name: 'Vec<u8>',
    symbol: 'Vec<u8>',
    decimals: 'u8'
  },
  LocId: 'u128',
  LegalOfficerCaseOf: {
    owner: 'AccountId',
    requester: 'Requester',
    metadata: 'Vec<MetadataItem>',
    files: 'Vec<File>',
    closed: 'bool',
    loc_type: 'LocType',
    links: 'Vec<LocLink>',
    void_info: 'Option<LocVoidInfo<LocId>>',
    replacer_of: 'Option<LocId>',
    collection_last_block_submission: 'Option<BlockNumber>',
    collection_max_size: 'Option<CollectionSize>'
  },
  MetadataItem: {
    name: 'Vec<u8>',
    value: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocType: {
    _enum: [
      'Transaction',
      'Identity',
      'Collection'
    ]
  },
  LocLink: {
    id: 'LocId',
    nature: 'Vec<u8>'
  },
  File: {
    hash: 'Hash',
    nature: 'Vec<u8>',
    submitter: 'AccountId'
  },
  LocVoidInfo: {
    replacer: 'Option<LocId>'
  },
  StorageVersion: {
    _enum: [
      'V1',
      'V2MakeLocVoid',
      'V3RequesterEnum',
      'V4ItemSubmitter',
      'V5Collection'
    ]
  },
  Requester: {
    _enum: {
      None: null,
      Account: 'AccountId',
      Loc: 'LocId'
    }
  },
  CollectionSize: 'u32',
  CollectionItemId: 'Hash',
  CollectionItem: {
    description: 'Vec<u8>'
  }
};

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        ...logionDefault
      }
    }
  ]
};

export default definitions;
