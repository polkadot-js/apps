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
        AccountInfo: 'AccountInfoWithDualRefCount',
        AccountInfoWithDualRefCount: {
          nonce: 'Index',
          consumers: 'RefCount',
          providers: 'RefCount',
          data: 'AccountData'
        },
        Campaign: {
          id: 'Hash',
          owner: 'AccountId',
          admin: 'AccountId',
          deposit: 'Balance',
          expiry: 'BlockNumber',
          cap: 'Balance',
          name: 'Vec<u8>',
          protocol: 'u8',
          governance: 'u8',
          cid: 'Vec<u8>',
          created: 'Timestamp'
        },
        Proposal: {
          proposal_id: 'Hash',
          campaign_id: 'Hash',
          purpose: 'Vec<u8>',
          cid: 'Vec<u8>',
          amount: 'Balance',
          expiry: 'BlockNumber',
          status: 'u8'
        },
        EventMessage: 'Vec<u8>',
        Nonce: 'u64',
        Entity: {
          account: 'AccountId',
          index: 'u128',
          cid: 'Vec<u8>',
          created: 'BlockNumber',
          mutated: 'BlockNumber'
        },
        EntityProperty: {
          value: 'u64',
          mutated: 'BlockNumber'
        },
        Item: {
          ItemId: 'ItemId',
          ItemInfo: 'ItemInfo'
        },
        ItemId: 'Hash',
        ItemInfo: {
          dob: 'u64',
          dna: 'Hash'
        },
        CID: 'Vec<u8>',
        HypaspaceInfo: 'Hash',
        HypaspaceMetadata: {
          name: 'Vec<u8>'
        }
      }
    }
  ]
};

export default definitions;
