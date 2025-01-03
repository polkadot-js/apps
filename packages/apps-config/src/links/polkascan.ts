// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types.js';

import { externalPolkascanPNG } from '../ui/logos/external/index.js';

export const Polkascan: ExternalDef = {
  chains: {
    // Kulupu: 'kulupu',
    Kusama: 'kusama',
    Polkadot: 'polkadot',
    Rococo: 'rococo'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://polkascan.io/${chain}/${path}/${data.toString()}`,
  homepage: 'https://polkascan.io/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block',
    council: 'council/motion',
    democracyProposal: 'democracy/proposal',
    democracyReferendum: 'democracy/referendum',
    extrinsic: 'transaction',
    techcomm: 'techcomm/proposal',
    treasury: 'treasury/proposal'
  },
  ui: {
    logo: externalPolkascanPNG
  }
};
