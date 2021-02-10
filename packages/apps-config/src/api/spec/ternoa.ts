// Copyright 2017-2021 @polkadot/apps-config authors & contributors
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
        Address: 'AccountId',
        CapsuleID: 'u32',
        CapsuleIDOf: 'CapsuleID',
        CapsuleData: {
          offchain_uri: 'Vec<u8>',
          pk_hash: 'Hash',
          creator: 'AccountId',
          owner: 'AccountId',
          locked: 'bool'
        },
        LookupSource: 'AccountId'
      }
    }
  ]
};

export default definitions;
