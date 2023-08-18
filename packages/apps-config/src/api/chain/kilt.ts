// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { typesBundle } from '@kiltprotocol/type-definitions';

if (!typesBundle.chain) {
  throw new Error('Unable to find chain defintions');
}

export default typesBundle.chain;
