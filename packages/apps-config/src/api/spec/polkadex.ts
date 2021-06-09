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
        ChainId: 'u8',
        ResourceId: '[u8; 32]',
        DepositNonce: 'u64',
        ProposalVotes: {
          votes_for: 'Vec<MultiAddress>',
          votes_against: 'Vec<MultiAddress>',
          status: 'enum'
        },
        Erc721Token: {
          id: 'TokenId',
          metadata: 'Vec<u8>'
        },
        TokenId: 'U256',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        AssetId: {
          _enum: [
            'POLKADEX',
            'BTC',
            'ETH',
            'DOT'
          ]
        },
        CurrencyIdOf: 'AssetId',
        CurrencyId: 'AssetId',
        ShardIdentifier: 'H256'
      }
    }
  ]
};

export default definitions;
