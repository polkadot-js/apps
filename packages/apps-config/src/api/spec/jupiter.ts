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
        LookupSource: 'MultiAddress',
        Address: 'MultiAddress',
        FullIdentification: 'AccountId',
        AuthorityState: {
          _enum: [
            'Working',
            'Waiting'
          ]
        },
        EraIndex: 'u32',
        ActiveEraInfo: {
          index: 'EraIndex',
          start: 'Option<u64>'
        },
        UnappliedSlash: {
          validator: 'AccountId',
          reporters: 'Vec<AccountId>'
        }
      }
    }
  ]
};

export default definitions;
