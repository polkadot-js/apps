// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { options } from '@frequency-chain/api-augment';

export default {
  ...options,
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: options.types
    }
  ]
} as OverrideBundleDefinition;
