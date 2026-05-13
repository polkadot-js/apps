// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { nodesHeimaSVG } from '../ui/logos/nodes/index.js';

export const HeimaExplorer: ExternalDef = {
  chains: {
    Heima: 'heima'
  },
  create: (_chain: string, path: string, data: BN | number | string): string =>
    `https://explorer.heima.network/${path}/${data.toString()}`,
  homepage: 'https://explorer.heima.network/',
  isActive: true,
  paths: {
    address: 'sub/account',
    block: 'sub/block',
    extrinsic: 'sub/extrinsic'
  },
  ui: {
    logo: nodesHeimaSVG
  }
};
