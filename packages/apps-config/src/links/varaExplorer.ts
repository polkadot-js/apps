// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalVaraExplorerPNG } from '../ui/logos/external/index.js';

export const VaraExplorer: ExternalDef = {
  chains: {
    Vara: 'vara',
    'Vara Network': 'vara'
  },
  create: (_: string, path: string, data: BN | number | string): string =>
    `https://explorer.vara.network/${path}/${encodeURIComponent(data.toString())}`,
  homepage: 'https://explorer.vara.network/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    extrinsic: 'extrinsic',
    referenda: 'referenda'
  },
  ui: {
    logo: externalVaraExplorerPNG
  }
};
