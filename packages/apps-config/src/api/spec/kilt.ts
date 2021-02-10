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
        BlockNumber: 'u64',
        DelegationNodeId: 'Hash',
        ErrorCode: 'u16',
        Index: 'u64',
        LookupSource: 'AccountId',
        Permissions: 'u32',
        PublicBoxKey: 'Hash',
        PublicSigningKey: 'Hash',
        RefCount: 'u8',
        Signature: 'MultiSignature'
      }
    }
  ]
};

export default definitions;
