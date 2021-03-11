// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD
/* eslint-disable sort-keys */
export default {
  Address: 'AccountId',
  LookupSource: 'AccountId'
};
=======
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
        LookupSource: 'AccountId'
      }
    }
  ]
};

export default definitions;
>>>>>>> 240b0f80c7c9eabc1bdd37e570d7fca653a0229f
