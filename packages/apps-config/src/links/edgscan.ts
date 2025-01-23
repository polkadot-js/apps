// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalEdgscanPNG } from '../ui/logos/external/index.js';

export const Edgscan: ExternalDef = {
  chains: {
    Edgeware: 'edgeware'
  },
  create: (_chain: string, path: string, data: BN | number | string): string =>
    `https://edgscan.ink/#/${path}/${data.toString()}`,
  homepage: 'https://edgscan.ink/',
  isActive: true,
  paths: {
    address: 'accounts',
    block: 'blocks',
    extrinsic: 'extrinsics'
  },
  ui: {
    logo: externalEdgscanPNG
  }
};
