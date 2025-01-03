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
        Balance: 'u64',
        NeuronMetadata: {
          version: 'u32',
          ip: 'u128',
          port: 'u16',
          ipType: 'u8',
          uid: 'u32',
          netuid: 'u16',
          modality: 'u8',
          hotkey: 'AccountId',
          coldkey: 'AccountId',
          active: 'u32',
          lastUpdate: 'u64',
          priority: 'u64',
          stake: 'u64',
          rank: 'u64',
          trust: 'u64',
          consensus: 'u64',
          incentive: 'u64',
          dividends: 'u64',
          emission: 'u64',
          bonds: 'Vec<(u32, u64)>',
          weights: 'Vec<(u32, u32)>'
        }
      }
    }
  ]
};

export default definitions;
