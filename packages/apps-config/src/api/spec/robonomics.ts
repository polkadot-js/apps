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
        Record: 'Vec<u8>',
        TechnicalParam: 'Vec<u8>',
        TechnicalReport: 'Vec<u8>',
        EconomicalParam: '{}',
        ProofParam: 'MultiSignature',
        LiabilityIndex: 'u64',
        ValidationFunctionParams: {
          max_code_size: 'u32',
          relay_chain_height: 'u32',
          code_upgrade_allowed: 'Option<u32>'
        }
      }
    }
  ]
};

export default definitions;
