// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // updated to Substrate master
      minmax: [0, undefined],
      types: {
        Keys: 'SessionKeys2'
      }
    }
  ]
};

export default definitions;
