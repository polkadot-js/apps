// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// We only load the definitions here explicitly - if we try to go via
//   import { types } from '@subsocial/types/substrate';
// we end up with multiple version of types/API since it uses CJS
import previous from '@subsocial/definitions/interfaces/subsocial/definitions'; // KEEP, see above

const defintions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [0, undefined],
      types: previous.types as Record<string, string>
    }
  ]
};

export default defintions;
