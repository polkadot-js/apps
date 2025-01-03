// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { keccakAsU8a } from '@polkadot/util-crypto';

const definitions: OverrideBundleDefinition = {
  hasher: keccakAsU8a
};

export default definitions;
