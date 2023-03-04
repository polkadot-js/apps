// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import cord from './cord';

// NOTE: The mapping is done from chain name in system.chain
const chain: Record<string, OverrideBundleDefinition> = {
  'Dev. Node': cord['Development'],
  'CORD Staging Testnet': cord['CORD Staging Testnet'],
  'Development': cord['Development'],
};

export default chain;
