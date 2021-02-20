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
        MogwaiStruct: {
          id: 'Hash',
          dna: 'Hash',
          genesis: 'BlockNumber',
          price: 'Balance',
          gen: 'u64'
        },
        MogwaiBios: {
          mogwai_id: 'Hash',
          state: 'u32',
          metaxy: 'Vec<[u8;16]>',
          intrinsic: 'Balance',
          level: 'u8',
          phases: 'Vec<BlockNumber>',
          adaptations: 'Vec<Hash>'
        },
        GameEvent: {
          id: 'Hash',
          begin: 'BlockNumber',
          duration: 'u16',
          event_type: 'GameEventType',
          hashes: 'Vec<Hash>',
          value: 'u64'
        },
        GameEventType: {
          _enum: [
            'Default',
            'Hatch'
          ]
        }
      }
    }
  ]
};

export default definitions;
