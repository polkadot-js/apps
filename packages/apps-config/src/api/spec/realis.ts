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
        TokenId: 'u32',
        Rarity: {
          _enum: [
            'Common',
            'Uncommon',
            'Rare',
            'Mythical',
            'Legendary'
          ]
        },
        Socket: {
          _enum: [
            'Head',
            'Body',
            'LegLeft',
            'LegRight',
            'ArmLeft',
            'ArmRight',
            'Weapon'
          ]
        },
        Params: {
          strength: 'u8',
          agility: 'u8',
          intelligence: 'u8'
        },
        Token: {
          rarity: 'Rarity',
          socket: 'Socket',
          params: 'Params'
        }
      }
    }
  ]
};

export default definitions;
