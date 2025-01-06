// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

/* eslint-disable sort-keys */
const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [
        266,
        281
      ],
      types: {
        ChainId: 'u8',
        DepositNonce: 'u64',
        ResourceId: '[u8; 32]',
        ProposalStatus: {
          _enum: [
            'Initiated',
            'Approved',
            'Rejected'
          ]
        },
        ProposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'ProposalStatus',
          expiry: 'BlockNumber'
        },
        TokenId: 'u256',
        Erc721Token: {
          id: 'TokenId',
          metadata: 'Vec<u8>'
        },
        Address: 'IndicesLookupSource',
        LookupSource: 'IndicesLookupSource',
        AccountInfo: 'AccountInfoWithDualRefCount',
        ValidatorPrefs: {
          commission: 'Compact<Perbill>'
        }
      }
    },
    {
      minmax: [
        282,
        294
      ],
      types: {
        ChainId: 'u8',
        DepositNonce: 'u64',
        ResourceId: '[u8; 32]',
        ProposalStatus: {
          _enum: [
            'Initiated',
            'Approved',
            'Rejected'
          ]
        },
        ProposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'ProposalStatus',
          expiry: 'BlockNumber'
        },
        TokenId: 'u256',
        Erc721Token: {
          id: 'TokenId',
          metadata: 'Vec<u8>'
        },
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AccountInfo: 'AccountInfoWithDualRefCount'
      }
    },
    {
      minmax: [295, null],
      types: {}
    }
  ]
};

export default definitions;
