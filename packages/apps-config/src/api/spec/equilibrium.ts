// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import eq from '@equilab/definitions';

const definitions: OverrideBundleDefinition = {
  derives: {
    // TODO [currency]: customAccount that is bound to eqBalances.account(address, currency)
  },

  instances: eq.latest.instances,

  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: eq.latest.types
    }
  ]
};

export default definitions;
