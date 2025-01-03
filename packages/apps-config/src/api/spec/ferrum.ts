// Copyright 2017-2025 @polkadot/apps-config authors & contributors
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
        AccountId: 'EthereumAccountId',
        AccountId20: 'EthereumAccountId',
        Address: 'AccountId',
        LookupSource: 'AccountId',
        Lookup0: 'AccountId',
        EthereumSignature: {
          r: 'H256',
          s: 'H256',
          v: 'U8'
        },
        ExtrinsicSignature: 'EthereumSignature'
      }
    }
  ]
};

export default definitions;
