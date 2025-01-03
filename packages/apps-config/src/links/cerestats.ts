// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalCerestatsPNG } from '../ui/logos/external/index.js';

export const CereStats: ExternalDef = {
  chains: {
    'Cere Mainnet Beta': 'cere'
  },
  create: (_: string, path: string, data: BN | number | string): string =>
    `https://stats.cere.network/${path}/${data.toString()}`,
  homepage: 'https://stats.cere.network',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    validator: 'validator'
  },
  ui: {
    logo: externalCerestatsPNG
  }
};
