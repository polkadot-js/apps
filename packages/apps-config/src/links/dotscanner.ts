// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { ExternalDef } from './types';

import { externalDotscannerPNG } from '../ui/logos/external';

export const DotScanner: ExternalDef = {
  chains: {
    Kusama: 'kusama',
    Polkadot: 'polkadot'
  },
  create: (chain: string, path: string, data: BN | number | string): string =>
    `https://dotscanner.com/${chain}/${path}/${data.toString()}?utm_source=polkadotjs`,
  homepage: 'https://dotscanner.com/',
  isActive: true,
  paths: {
    address: 'account',
    block: 'block'
  },
  ui: {
    logo: externalDotscannerPNG
  }
};