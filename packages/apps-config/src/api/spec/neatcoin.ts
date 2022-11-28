// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: {
        Label: 'Vec<u8>',
        Name: 'Vec<Label>',
        NameHash: 'H256',
        Value: {
          _enum: {
            U32: 'U32',
            U64: 'U64',
            U128: 'U128',
            Bool: 'Bool'
          }
        }
      }
    }
  ]
};

export default definitions;
