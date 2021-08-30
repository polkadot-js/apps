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
        ConsensusLog: {
          _enum: {
            Phantom: 'Null',
            NextEpochData: 'NextEpochDescriptor',
            NextConfigData: 'NextConfigDescriptor',
            SolutionRangeData: 'SolutionRangeDescriptor',
            SaltData: 'SaltDescriptor',
            NextSolutionRangeData: 'NextSolutionRangeDescriptor',
            NextSaltData: 'NextSaltDescriptor'
          }
        },
        NextEpochDescriptor: {
          randomness: 'Randomness'
        },
        NextConfigDescriptor: {
          _enum: {
            V0: 'Null',
            V1: 'NextConfigDescriptorV1'
          }
        },
        NextConfigDescriptorV1: {
          c: '(u64, u64)'
        },
        SolutionRangeDescriptor: {
          solution_range: 'u64'
        },
        SaltDescriptor: {
          salt: 'u64'
        },
        NextSolutionRangeDescriptor: {
          solution_range: 'u64'
        },
        NextSaltDescriptor: {
          salt: 'u64'
        }
      }
    }
  ]
};

export default definitions;
