// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

import { CustomDefinition } from '../types';

const definition: CustomDefinition = {
  alias: {},
  rpc: {},
  types: [{
    minmax: [0, undefined],
    types: {
      Address: 'AccountId',
      LookupSource: 'AccountId'
    }
  }]
};

export default definition;
