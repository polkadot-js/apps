// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import kilt from './kilt';

// NOTE: The mapping is done from chain name in system.chain
const chain: Record<string, OverrideBundleDefinition> = {
  'KILT Mashnet': kilt['KILT Mashnet'],
  'KILT Peregrine': kilt['KILT Peregrine'],
  'KILT Peregrine Stagenet': kilt['KILT Peregrine Stagenet'],
  'KILT Spiritnet': kilt['KILT Spiritnet'],
  'KILT Spiritnet Develop': kilt['KILT Spiritnet Develop']
};

export default chain;
