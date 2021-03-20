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
        Difficulty: 'U256',
        DifficultyAndTimestamp: {
          difficulty: 'Difficulty',
          timestamp: 'Moment'
        },
        Era: {
          genesisBlockHash: 'H256',
          finalBlockHash: 'H256',
          finalStateRoot: 'H256'
        },
        RefCount: 'u8'
      }
    }
  ]
};

export default definitions;
