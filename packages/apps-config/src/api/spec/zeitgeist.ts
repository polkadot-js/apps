// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import * as typeDefs from '@zeitgeistpm/type-defs';

import { typesFromDefs } from '../util';

const bundle = {
  types: [{
    minmax: [0, undefined],
    types: { ...typesFromDefs(typeDefs) }
  }]
};

export default bundle as OverrideBundleDefinition;
