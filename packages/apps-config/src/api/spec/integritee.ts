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
        Address: 'MultiAddress',
        Enclave: {
          mrenclave: 'Hash',
          pubkey: 'AccountId',
          timestamp: 'u64',
          url: 'Text'
        },
        LookupSource: 'MultiAddress',
        Request: {
          cyphertext: 'Vec<u8>',
          shard: 'ShardIdentifier'
        },
        ShardIdentifier: 'Hash'
      }
    }
  ]
};

export default definitions;
