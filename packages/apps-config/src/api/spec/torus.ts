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
        Balance: 'u128',
        ValidatorFee: {
          stakingFee: 'Percent',
          weightControlFee: 'Percent'
        },
        AgentMetadata: {
          key: 'AccountId32',
          name: 'Vec<u8>',
          url: 'Vec<u8>',
          metadata: 'Vec<u8>',
          weight_penalty_factor: 'Percent',
          registration_block: 'u64',
          fees: 'ValidatorFee'
        }
      }
    }
  ]
};

export default definitions;
