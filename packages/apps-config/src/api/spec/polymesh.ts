// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import schema from '@polymathnetwork/polymesh-types';

const definitions: OverrideBundleDefinition = {
    types: [
      {
        // on all versions
        minmax: [0, undefined],
        types: schema.types
      }
    ],
    rpc: schema.rpc
}

export default definitions;
