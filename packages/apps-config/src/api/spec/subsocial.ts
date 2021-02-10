// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import * as subsocialDefinitions from '@subsocial/types/substrate/interfaces/definitions';

import { typesFromDefs } from '../util';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: typesFromDefs(subsocialDefinitions)
    }
  ]
};

export default definitions;
