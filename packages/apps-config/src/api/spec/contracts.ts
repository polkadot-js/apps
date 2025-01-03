// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, 8],
      types: {
        Address: 'AccountId',
        Keys: 'SessionKeys2',
        LookupSource: 'AccountId',
        Schedule: 'ScheduleTo258'
      }
    },
    {
      // updated to Substrate master
      minmax: [9, undefined],
      types: {
        Keys: 'SessionKeys2'
      }
    }
  ]
};

export default definitions;
