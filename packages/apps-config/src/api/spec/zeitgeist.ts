// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import * as typeDefs from '@zeitgeistpm/type-defs';

import { typesFromDefs } from '../util';

const bundle = {
  alias: {
    tokens: {
      AccountData: 'TokensAccountData'
    }
  },
  types: [{
    minmax: [0, undefined],
    types: {
      ...typesFromDefs(typeDefs),
      TokensAccountData: {
        free: 'Balance',
        frozen: 'Balance',
        reserved: 'Balance'
      }
    }
  }]
};

export default bundle as never as OverrideBundleDefinition;
