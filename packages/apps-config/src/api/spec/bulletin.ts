// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: {
        HashingAlgorithm: {
          _enum: ['Blake2b256', 'Sha2_256', 'Keccak256']
        },
        CidConfig: {
          codec: 'u64',
          hashing: 'HashingAlgorithm'
        }
      }
    }
  ],
  signedExtensions: {
    ProvideCidConfig: {
      extrinsic: {
        cidConfig: 'Option<CidConfig>'
      },
      payload: {}
    }
  }
};

export default definitions;
