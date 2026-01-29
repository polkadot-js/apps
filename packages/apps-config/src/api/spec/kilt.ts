// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { typesBundle } from '@kiltprotocol/type-definitions';

if (!typesBundle.spec) {
  throw new Error('Unable to find chain definitions');
}

export default typesBundle.spec;
