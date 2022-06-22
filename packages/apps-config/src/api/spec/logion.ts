// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import logionDefault, { session as logionSession } from '@logion/node-api/dist/interfaces/definitions';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        ...logionDefault.types,
        ...logionSession.types
      }
    }
  ]
};

export default definitions;
