// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        Address: 'AccountId',
        LookupSource: 'AccountId'
      }
    }
  ]
};

export default definitions;
