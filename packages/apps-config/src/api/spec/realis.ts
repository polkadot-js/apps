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
        Rarity: {
          _enum: [
            'Common',
            'Uncommon',
            'Rare',
            'Epic',
            'Legendary',
            'Relic'
          ]
        },
        Basic: 'u8',
        TokenId: 'U256',
        Stackable: {
          _enum: [
            'Silver',
            'Gold',
            'Diamond'
          ]
        },
        String: 'Vec<u8>',
        TokenType: {
          _enum: {
            Basic: '(Basic, Rarity, String)'
          }
        },
        Status: {
          _enum: [
            'OnSell',
            'InDelegation',
            'Free'
          ]
        },
        Token: {
          token_id: 'TokenId',
          token: 'TokenType'
        }
      }
    }
  ]
};

export default definitions;
