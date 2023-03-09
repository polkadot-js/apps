// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import schema from '@polymeshassociation/polymesh-types';

const definitions: OverrideBundleDefinition = {
  rpc: schema.default.rpc,
  signedExtensions: schema.default.signedExtensions,
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: schema.default.types
    }
  ]
};

export default definitions;
